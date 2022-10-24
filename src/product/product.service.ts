import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionValue } from 'src/option/option-value.entity';
import { OptionService } from 'src/option/option.service';

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
		@InjectRepository(OptionValue)
		readonly productValuesRepo: Repository<OptionValue>
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

		product.productValues = currentValues;

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
				productValues: { value: true, option: { optionName: true } },
			},
			where: { hidden: false },
			relations: {
				category: true,
				brand: true,
				productValues: { option: true },
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
		if (dto.valuesIds) {
			const currentValues = await this.optionService.getByIds(dto.valuesIds);
			const shortInfo = createShortInfo(currentValues);
			product.shortInfo = shortInfo;
			product.productValues = currentValues;
		}
		return await this.productRepo.save(product);
	}
}
