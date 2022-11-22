import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionService } from 'src/option/option.service';
import { OrderProduct } from 'src/order/entities/order-product.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
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
			name: dto.name,
			price: dto.price,
			brand: { id: dto.brandId },
			category: { id: dto.categoryId },
		});

		return await this.productRepo.save(newProduct);
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

	async deleteOptions(id: number, keys: string[]) {
		const product = await this.byId(id);
		if (!product) {
			throw new NotFoundException('Продукт не найден!');
		}
		for (const key of keys) {
			if ((product.options as Object).hasOwnProperty(key)) {
				delete product.options[key];
			}
		}
		return this.productRepo.save(product);
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

	async all(category: string, page: number, limit: number) {
		let offset = page * limit - limit;

		const filters = [
			{ key: 'ram', value: '8gb' },
			{ key: 'hdd', value: ['256gb', '512gb'] },
		];

		const p = this.productRepo
			.createQueryBuilder('p')
			.innerJoinAndSelect('p.category', 'c')
			.innerJoinAndSelect('p.brand', 'b')
			.where('c.name = :name', { name: category });
		for (const filter of filters) {
			if (Array.isArray(filter.value)) {
				const values = filter.value.map(v => `'${v}'`).join();
				p.andWhere(`p.options ->> '${filter.key}' IN (${values})`);
			} else {
				p.andWhere(`p.options @> '{"${filter.key}": "${filter.value}"}'`);
			}
		}
		p.offset(offset);

		const response = await p.getManyAndCount();
		return {
			count: response[1],
			products: response[0],
		};
	}

	async getProductInfo(id: number) {
		const product = await this.productRepo.findOne({
			where: { id },
			relations: {
				category: true,
				brand: true,
				images: true,
			},
			select: {
				options: {},
				id: true,
				name: true,
				discount_percentage: true,
				price: true,
				inStock: true,
				status: true,
				description: true,
				poster: true,
				category: {
					id: true,
					name: true,
				},
				brand: {
					id: true,
					name: true,
				},
			},
		});
		if (!product) {
			throw new NotFoundException('Продукт не найден!');
		}
		const rate = await this.getAverageRate(product.id);

		return {
			...product,
			rate,
		};
	}

	async addImage(path: string, productId) {
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
		product.images = [...product.images, img];
		return this.productRepo.save(product);
	}

	async toggleHidden(id: number) {
		const product = await this.productRepo.findOne({ where: { id } });
		if (!product) {
			throw new BadRequestException('Продукта не существует!');
		}
		product.hidden = !product.hidden;
		return await this.productRepo.save(product);
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

	async getAverageRate(productId: number) {
		const avg = await this.ratingRepo
			.createQueryBuilder('rating')
			.select('AVG(rating.rate)', 'average')
			.where('rating.product = :id', { id: productId })
			.getRawOne<{ average: string }>();

		return {
			avg: parseFloat(avg.average),
		};
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
}
