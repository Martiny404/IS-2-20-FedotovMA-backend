import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';

@Injectable()
export class BrandService {
	constructor(
		@InjectRepository(Brand) private readonly brandRepo: Repository<Brand>,
		private readonly categoryService: CategoryService
	) {}
	async create({ name }: CreateBrandDto) {
		const isBrandExist = await this.brandRepo.findOne({ where: { name } });

		if (isBrandExist) {
			throw new BadRequestException(
				'Производитель с таким именем уже существует!'
			);
		}

		const brand = this.brandRepo.create({
			name,
		});
		return await this.brandRepo.save(brand);
	}

	async addCategories(id: number, categories: number[]) {
		const brandCategories = await Promise.all(
			categories.map(async id => {
				try {
					const category = await this.categoryService.byId(id);
					return category;
				} catch (e) {
					throw e;
				}
			})
		);
		const brand = await this.brandRepo.findOne({ where: { id } });

		if (!brand) throw new BadRequestException('Такого бренда нету!');

		const withoutNull = brandCategories.filter(c => c !== null);

		brand.categories = withoutNull;

		return await this.brandRepo.save(brand);
	}
}
