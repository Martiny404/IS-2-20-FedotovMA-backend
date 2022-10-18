import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(Product) private readonly productRepo: Repository<Product>
	) {}

	async create(dto: CreateProductDto) {
		try {
			const isProductExist = await this.productRepo.findOne({
				where: { name: dto.name },
			});

			if (isProductExist) {
				throw new BadRequestException('Продукт с таким именем уже существует!');
			}

			const product = this.productRepo.create({
				name: dto.name,
				price: dto.price,
				brand: { id: dto.brandId },
				category: { id: dto.categoryId },
			});
			return await this.productRepo.save(product);
		} catch (e) {
			throw e;
		}
	}
	async byId(id: number) {
		try {
			return await this.productRepo.findOneBy({ id });
		} catch (e) {
			throw e;
		}
	}
}
