import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionService } from 'src/option/option.service';
import { In, Repository } from 'typeorm';
import { addOptionsToProductDto } from './dto/add-options.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { updateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(Product)
		private readonly productRepo: Repository<Product>,
		private readonly optionService: OptionService
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
			relations: { productValues: true },
		});
		if (!product) {
			throw new BadRequestException('Продукта не существует!');
		}

		const currentValues = await this.optionService.getByIds(dto.valuesIds);

		product.productValues = [...product.productValues, ...currentValues];

		await this.productRepo.save(product);
		return product;
	}
	async all() {
		const p = await this.productRepo.find({
			select: {
				category: { id: true, name: true },
				brand: { id: true, name: true },
				productValues: true,
			},
			relations: {
				category: true,
				brand: true,
				productValues: { option: true },
			},
		});

		return p;
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
}
