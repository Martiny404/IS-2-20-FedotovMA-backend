import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionService } from 'src/option/option.service';
import { ProductValues } from 'src/option/product-values.entity';
import { Repository } from 'typeorm';
import { addOptionsToProductDto } from './dto/add-options.dto';
import { CreateProductDto } from './dto/create-product.dto';
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
		try {
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
		} catch (e) {
			throw e;
		}
	}
	async update(id: number, dto: addOptionsToProductDto) {
		try {
			const currentValues = await this.optionService.getByIds(dto.valuesIds);

			let description = '';

			currentValues.forEach(value => {
				description += `${value.option.optionName}: ${value.value}; `;
			});

			await Promise.all(
				dto.valuesIds.map(async v => {
					try {
						const prodValue = this.productValuesRepo.create({
							product: { id },
							productValue: { id: v },
						});
						return this.productValuesRepo.save(prodValue);
					} catch (e) {
						throw new InternalServerErrorException('server error--_--');
					}
				})
			);

			const product = await this.productRepo.findOne({ where: { id } });
			if (!product) {
				throw new BadRequestException('Продукта не существует!');
			}
			product.description = description;
			await this.productRepo.save(product);
			return { message: 'Ok' };
		} catch (e) {
			throw e;
		}
	}
	async all() {
		try {
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
		} catch (e) {
			throw e;
		}
	}

	async toggleHidden(id: number) {
		const product = await this.productRepo.findOne({ where: { id } });
		if (!product) {
			throw new BadRequestException('Продукта не существует!');
		}
		product.hidden = !product.hidden;
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
