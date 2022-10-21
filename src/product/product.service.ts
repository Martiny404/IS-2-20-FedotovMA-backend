import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionService } from 'src/option/option.service';
import { ProductValues } from 'src/option/product-values.entity';
import { createShortInfo } from 'src/utils/createShortInfo';
import { Repository } from 'typeorm';
import { addOptionsToProductDto } from './dto/add-options.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { updateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(Product)
		private readonly productRepo: Repository<Product>,
		private readonly optionService: OptionService,
		@InjectRepository(ProductValues)
		readonly productValuesRepo: Repository<ProductValues>
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
			throw new BadRequestException('Продукта не существует!');
		}

		const currentValues = await this.optionService.getByIds(dto.valuesIds);

		await Promise.all(
			dto.valuesIds.map(async v => {
				try {
					const prodValue = this.productValuesRepo.create({
						product: { id },
						productValue: { id: v },
					});
					return await this.productValuesRepo.save(prodValue);
				} catch (e) {
					throw new InternalServerErrorException('ошибка сервера');
				}
			})
		);

		const shortInfo = createShortInfo(currentValues);

		product.shortInfo = shortInfo;
		await this.productRepo.save(product);
		return product;
	}
	async all() {
		const products = await this.productRepo.find({
			select: {
				category: { id: true, name: true },
				brand: { id: true, name: true },
				productValues: { id: true, productValue: { value: true } },
			},
			where: { hidden: false },
			relations: {
				category: true,
				brand: true,
				productValues: {
					productValue: {
						option: true,
					},
				},
			},
		});

		return products;
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
		if (dto.productValues) {
			await Promise.all(
				dto.productValues.map(async v => {
					try {
						const prodValue = this.productValuesRepo.create({
							product: { id },
							productValue: { id: v },
						});
						return await this.productValuesRepo.save(prodValue);
					} catch (e) {
						throw new InternalServerErrorException('ошибка сервера');
					}
				})
			);
		}
		return await this.productRepo.save(product);
	}
}

// const result = this.productRepo
// 	.createQueryBuilder('product')
// 	.innerJoinAndSelect('product.brand', 'brand')
// 	.innerJoinAndSelect('product.category', 'category')
// 	.innerJoinAndSelect('product.productValues', 'productValues')
// 	.innerJoinAndSelect('productValues.productValue', 'value')
// 	.innerJoinAndSelect('value.option', 'option')
// 	.andWhere('product.hidden = false');

// const products = await result.getMany();
