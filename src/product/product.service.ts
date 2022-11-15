import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionService } from 'src/option/option.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { addOptionsToProductDto } from './dto/add-options.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { updateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Rating } from './entities/rating.entity';

@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(Product)
		private readonly productRepo: Repository<Product>,
		private readonly optionService: OptionService,
		private readonly userService: UserService,
		@InjectRepository(Rating) private readonly ratingRepo: Repository<Rating>
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

		try {
			return await this.productRepo.save(newProduct);
		} catch (e) {
			throw new BadRequestException(e.message);
		}
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

	async byId(id: number) {
		const product = await this.productRepo.findOne({ where: { id } });

		return product;
	}
	async all() {
		let page = 1;
		let limit = 9;
		let offset = page * limit - limit;

		const filters = [
			{ key: 'ram', value: '8gb' },
			{ key: 'hdd', value: ['256gb', '512gb'] },
		];

		const category = 'Ноутбук';

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
		const response = await p.getManyAndCount();
		return {
			count: response[1],
			products: response[0],
		};
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
			throw new BadRequestException('Продукта не существует!');
		}
		product.name = dto.name;
		if (dto.price) product.price = dto.price;
		if (dto.status) product.status = dto.status;
		if (dto.discount_percentage)
			product.discount_percentage = dto.discount_percentage;
		if (dto.categoryId) product.category.id = dto.categoryId;
		if (dto.brandId) product.brand.id = dto.brandId;
		if (dto.price) product.price = dto.price;
		return await this.productRepo.save(product);
	}

	async evaluteProduct(userId: number, productId: number, rate: number) {
		try {
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
		} catch (e) {
			throw e;
		}
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
}

//(foo ->> 'a')::boolean is true;
