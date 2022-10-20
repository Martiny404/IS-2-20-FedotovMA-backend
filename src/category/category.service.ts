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
		const category = await this.categoryRepo.findOne({
			where: { name: categoryName },
			relations: { options: true },
		});
		if (!category) {
			throw new BadRequestException('Категории не существует!');
		}
		return category;
	}
	async byId(id: number) {
		return await this.categoryRepo.findOne({ where: { id } });
	}

	async getAllOptions() {
		return await this.categoryRepo.find({ relations: { options: true } });
	}
}
