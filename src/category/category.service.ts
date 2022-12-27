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
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
	constructor(
		@InjectRepository(Category)
		private readonly categoryRepo: Repository<Category>,
		private readonly optionService: OptionService
	) {}

	async getAll() {
		return this.categoryRepo.find();
	}

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

	async update(categoryId: number, dto: UpdateCategoryDto) {
		const category = await this.categoryRepo.findOne({
			where: { id: categoryId },
		});

		if (!category) {
			throw new NotFoundException('Категории не существует!');
		}

		return this.categoryRepo.save({
			...category,
			...dto,
		});
	}

	async remove(id: number) {
		const category = await this.categoryRepo.findOne({
			where: { id },
		});
		if (!category) {
			throw new NotFoundException('Категории не существует!');
		}

		await this.categoryRepo.remove(category);
		return true;
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
			relations: {
				options: true,
			},
		});
		if (!category) {
			throw new NotFoundException('Категории не существует!');
		}
		return category;
	}

	async addOption(categoryId: number, optionId: number) {
		const option = await this.optionService.byId(optionId);

		const category = await this.categoryRepo.findOne({
			where: { id: categoryId },
			relations: {
				options: true,
			},
		});
		if (!category) {
			throw new NotFoundException('Категории не существует!');
		}
		const isExist = category.options.find(op => op.id == option.id);

		if (isExist) {
			throw new BadRequestException('Эта характеристика уже есть!');
		}

		category.options = [...category.options, option];

		return this.categoryRepo.save(category);
	}

	async removeOption(categoryId: number, optionId: number) {
		const option = await this.optionService.byId(optionId);

		const category = await this.categoryRepo.findOne({
			where: { id: categoryId },
			relations: {
				options: true,
			},
		});
		if (!category) {
			throw new NotFoundException('Категории не существует!');
		}
		const newOptions = category.options.filter(op => op.id != option.id);

		category.options = newOptions;
		await this.categoryRepo.save(category);
		return true;
	}

	async getAllOptions(categoryId: number) {
		return await this.categoryRepo.findOne({
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
