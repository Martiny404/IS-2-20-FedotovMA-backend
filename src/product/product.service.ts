import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionService } from 'src/option/option.service';
import { OrderProduct } from 'src/order/entities/order-product.entity';
import { IFilter } from 'src/types/producr-filter.types';
import { UserService } from 'src/user/user.service';
import { FindOperator, ILike, In, MoreThan, Repository } from 'typeorm';
import { addOptionsToProductDto } from './dto/add-options.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { updateProductDto } from './dto/update-product.dto';
import { ProductImages } from './entities/product-imgs.entity';
import { Product, ProductStatus } from './entities/product.entity';
import { Rating } from './entities/rating.entity';

@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(Product)
		private readonly productRepo: Repository<Product>,
		private readonly optionService: OptionService,
		private readonly userService: UserService,
		@InjectRepository(Rating) private readonly ratingRepo: Repository<Rating>,
		@InjectRepository(ProductImages)
		private readonly productImgRepo: Repository<ProductImages>
	) {}

	async create(dto: CreateProductDto) {
		const isProductExist = await this.productRepo.findOne({
			where: { name: dto.name },
		});

		if (isProductExist) {
			throw new BadRequestException('Продукт с таким именем уже существует!');
		}

		const newProduct = this.productRepo.create({
			brand: { id: dto.brandId },
			category: { id: dto.categoryId },
			...dto,
		});

		return await this.productRepo.save(newProduct);
	}

	async search(searchTerm: string) {
		const products = await this.productRepo.find({
			where: [
				{ name: ILike(`%${searchTerm}%`) },
				{
					category: {
						name: ILike(`%${searchTerm}%`),
					},
				},
				{
					brand: {
						name: ILike(`%${searchTerm}%`),
					},
				},
			],
			relations: {
				category: true,
				brand: true,
			},
			take: 6,
		});
		return products;
	}

	async incrementViews(productId: number) {
		const product = await this.byId(productId);
		if (!product) {
			throw new NotFoundException('Продукт не найден!');
		}
		product.views += 1;
		await this.productRepo.save(product);
	}

	async deleteProduct(productId: number) {
		const product = await this.byId(productId);
		if (!product) {
			throw new NotFoundException('Продукт не найден!');
		}
		await this.productRepo.remove(product);
		return true;
	}

	async addOptions(id: number, dto: addOptionsToProductDto) {
		const product = await this.productRepo.findOne({
			where: { id },
		});
		if (!product) {
			throw new NotFoundException('Продукт не найден!');
		}

		const option = await this.optionService.byId(dto.optionId);
		const value = option.values.find(el => el.id == dto.optionValueId);

		if (!value) {
			throw new BadRequestException('Значения не существует!');
		}

		product.options = { ...product.options, [option.optionName]: value.value };

		await this.productRepo.save(product);
		return product;
	}

	async deleteOptions(id: number, key: string) {
		const product = await this.byId(id);
		if (!product) {
			throw new NotFoundException('Продукт не найден!');
		}

		if ((product.options as Object).hasOwnProperty(key)) {
			delete product.options[key];
		}

		return this.productRepo.save(product);
	}

	async deleteImage(imageId: number) {
		const image = await this.productImgRepo.findOne({
			where: {
				id: imageId,
			},
		});
		if (!image) {
			throw new NotFoundException('Фото нету!');
		}
		await this.productImgRepo.remove(image);
		return true;
	}

	async reduceQuantity(id: number, q: number) {
		const product = await this.byId(id);
		if (!product) {
			throw new NotFoundException('Продукт не найден!');
		}
		if (product.inStock - q < 0) return;

		if (product.inStock - q == 0) {
			product.inStock -= q;
			product.status = ProductStatus.NOT_AVAILABLE_FOR_FALSE;
			return await this.productRepo.save(product);
		}
		product.inStock -= q;
		return await this.productRepo.save(product);
	}

	async reduceSeveralQuantity(orderProducts: OrderProduct[]) {
		if (orderProducts.length == 0) return;
		await Promise.all(
			orderProducts.map(async op => {
				return await this.reduceQuantity(op.product.id, op.quantity);
			})
		);
	}

	async byId(id: number) {
		const product = await this.productRepo.findOne({ where: { id } });
		return product;
	}

	async getCatalog(
		categoryId?: number,
		page: number = 1,
		brandId?: number,
		filters: IFilter[] = []
	) {
		let offset = page * 9 - 9;

		const p = this.productRepo
			.createQueryBuilder('p')
			.leftJoinAndSelect('p.category', 'c')
			.leftJoinAndSelect('p.brand', 'b')
			.leftJoinAndSelect('p.rating', 'r')
			.leftJoinAndSelect('p.productOrders', 'op');

		if (categoryId) {
			p.where('c.id = :id', { id: categoryId });
		}

		if (brandId) {
			p.where('b.id = :id', { id: brandId });
		}

		for (const filter of filters) {
			const values = filter.value.map(v => `'${v}'`).join();
			p.andWhere(`p.options ->> '${filter.key}' IN (${values})`);
		}
		p.offset(offset);
		p.limit(9);

		const response = await p.getManyAndCount();

		const product = response[0].map(p => {
			const r = {
				...p,
				rating: p.rating.reduce((acc, v) => {
					return acc + v.rate;
				}, 0),
			};
			return {
				...r,
				rating: r.rating ? r.rating / p.rating.length : 0,
				productOrders: r.productOrders.length,
			};
		});

		//[{"key": "hdd", "value": ["256gb"]}]

		return {
			count: response[1],
			products: product,
		};
	}

	async all() {
		return this.productRepo.find();
	}

	async getProductInfo(id: number) {
		const product = await this.productRepo.findOne({
			where: { id },
			relations: {
				category: true,
				brand: true,
				rating: true,
				productOrders: true,
				images: true,
			},
		});
		if (!product) {
			throw new NotFoundException('Продукт не найден!');
		}

		const rating = product.rating.reduce((acc, v) => {
			return acc + v.rate;
		}, 0);
		const count = product.productOrders.length;

		return {
			...product,
			rating: rating ? rating / product.rating.length : 0,
			productOrders: count,
		};
	}

	async addImage(path: string, productId: number) {
		const product = await this.productRepo.findOne({
			where: { id: productId },
			relations: { images: true },
		});
		if (!product) {
			throw new NotFoundException('Продукт не найден!');
		}
		const img = this.productImgRepo.create({
			photo: path,
			product: { id: product.id },
		});
		return this.productImgRepo.save(img);
	}

	async update(id: number, dto: updateProductDto) {
		const product = await this.productRepo.findOne({ where: { id } });

		if (!product) {
			throw new NotFoundException('Продукт не найден!');
		}

		return await this.productRepo.save({
			...product,
			...dto,
		});
	}

	async evaluteProduct(userId: number, productId: number, rate: number) {
		const user = await this.userService.byId(userId);
		const product = await this.byId(productId);

		if (!user || !product) {
			throw new NotFoundException('Продукт или пользователь не найден!');
		}

		const isExistRate = await this.ratingRepo.findOne({
			where: { user: { id: userId }, product: { id: productId } },
		});

		if (isExistRate) {
			throw new BadRequestException('Вы уже поставили оценку!');
		}

		const productRate = this.ratingRepo.create({
			product: product,
			user: user,
			rate,
		});
		return this.ratingRepo.save(productRate);
	}

	async getUserProdcutRate(userId: number, productId: number) {
		const user = await this.userService.byId(userId);
		const product = await this.byId(productId);

		if (!user || !product) {
			throw new NotFoundException('Продукт или пользователь не найден!');
		}

		const rate = await this.ratingRepo.findOne({
			where: { user: { id: userId }, product: { id: productId } },
		});

		if (!rate) {
			return 'Вы еще не поставили оценку!';
		}

		return rate.rate;
	}

	async getAverageRate(productId: number) {
		const product = await this.productRepo.findOne({
			where: { id: productId },
			relations: {
				rating: true,
			},
		});
		if (!product) {
			throw new NotFoundException('Продукт не найден!');
		}
		const rating = product.rating.reduce((acc, v) => {
			return acc + v.rate;
		}, 0);

		return rating ? rating / product.rating.length : 0;
	}

	async returnProductFromOrder(id: number, q: number) {
		const product = await this.byId(id);
		if (!product) {
			throw new NotFoundException('Продукт не найден!');
		}
		if (
			product.inStock == 0 &&
			product.status == ProductStatus.NOT_AVAILABLE_FOR_FALSE
		) {
			product.inStock += q;
			product.status = ProductStatus.ON_SALE;
			return this.productRepo.save(product);
		}
		product.inStock += q;
		return this.productRepo.save(product);
	}

	async returnSeveralProductsFromOrder(orderProducts: OrderProduct[]) {
		if (orderProducts.length == 0) return;
		await Promise.all(
			orderProducts.map(async op => {
				return await this.returnProductFromOrder(op.product.id, op.quantity);
			})
		);
	}

	async getProductsWithDiscountByCategory(categoryId: number) {
		const products = this.productRepo.find({
			where: {
				category: { id: categoryId },
				discount_percentage: MoreThan(0),
			},
			relations: {
				category: true,
				brand: true,
			},
		});
		return products;
	}
	async getProductsWithDiscountByBrand(brandId: number) {
		const products = this.productRepo.find({
			where: {
				brand: { id: brandId },
				discount_percentage: MoreThan(0),
			},
			relations: {
				category: true,
				brand: true,
			},
		});
		return products;
	}
}
