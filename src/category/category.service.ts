import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionService } from 'src/option/option.service';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
	constructor(
		@InjectRepository(Category)
		private readonly categoryRepo: Repository<Category>,
		private readonly optionService: OptionService
	) {}

	async create({ name, categoryImgPath }: CreateCategoryDto) {
		const isCategoryExist = await this.byName(name);

		if (isCategoryExist) {
			throw new BadRequestException('Категория с таким именем уже существует!');
		}

		const category = this.categoryRepo.create({
			name,
			categoryImgPath,
		});
		return await this.categoryRepo.save(category);
	}

	async byName(categoryName: string) {
		const category = await this.categoryRepo.findOne({
			where: { name: categoryName },
			relations: { options: true },
		});
		return category;
	}
	async byId(id: number) {
		const category = await this.categoryRepo.findOne({
			where: { id },
			relations: ['options'],
		});
		if (!category) {
			throw new NotFoundException('Категории не существует!');
		}
		return category;
	}

	async addOption(categoryId: number, optionId: number) {
		const option = await this.optionService.byId(optionId);

		const category = await this.byId(categoryId);

		category.options = [...category.options, option];

		return this.categoryRepo.save(category);
	}

	async getAllOptions(categoryId: number) {
		return await this.categoryRepo.find({
			where: {
				id: categoryId,
			},
			relations: {
				options: {
					values: true,
				},
			},
		});
	}
}
