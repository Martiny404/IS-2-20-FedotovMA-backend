import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
	constructor(
		@InjectRepository(Category)
		private readonly categoryRepo: Repository<Category>
	) {}
	async create({ name }: CreateCategoryDto) {
		try {
			const isCategoryExist = await this.categoryRepo.findOne({
				where: { name },
			});

			if (isCategoryExist) {
				throw new BadRequestException(
					'Категория с таким именем уже существует!'
				);
			}

			const category = this.categoryRepo.create({
				name,
			});
			return await this.categoryRepo.save(category);
		} catch (e) {
			throw e;
		}
	}

	async byName(categoryName: string) {
		return await this.categoryRepo.findOne({ where: { name: categoryName } });
	}
	async byId(id: number) {
		return await this.categoryRepo.findOne({ where: { id } });
	}
}
