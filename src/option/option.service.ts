import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionValue } from './option-value.entity';
import { CategoryService } from 'src/category/category.service';
import { Repository } from 'typeorm';
import { Option } from './option.entity';

@Injectable()
export class OptionService {
	constructor(
		@InjectRepository(Option) private readonly optionRepo: Repository<Option>,
		@InjectRepository(OptionValue)
		private readonly optionValueRepo: Repository<OptionValue>,
		private readonly categoryService: CategoryService
	) {}

	async create(name: string, categories: number[]) {
		const isOptExist = await this.optionRepo.findOne({
			where: { optionName: name },
		});

		if (isOptExist) {
			throw new BadRequestException('Такая характеристика уже есть!');
		}

		const opt = this.optionRepo.create({ optionName: name });

		const result = await Promise.all(
			categories.map(async id => {
				const category = await this.categoryService.byId(id);
				return category;
			})
		);
		const withoutNull = result.filter(c => c !== null);

		opt.categories = withoutNull;

		return await this.optionRepo.save(opt);
	}

	async addOptionValues(optionId: number, values: string[]) {
		const option = await this.optionRepo.findOne({
			where: { id: optionId },
			relations: {
				values: true,
			},
		});

		if (!option)
			throw new BadRequestException('Такой характеристики не существует!');

		const optionValues = [];

		values.forEach(value =>
			optionValues.push(this.optionValueRepo.create({ value }))
		);

		if (option.values && option.values.length > 0) {
			option.values = [...option.values, ...optionValues];
		} else {
			option.values = optionValues;
		}

		try {
			await this.optionRepo.save(option);
		} catch (e) {
			throw new BadRequestException(e.message);
		}
		return option;
	}

	async getByIds(valuesIds: number[]) {
		const findOpt = valuesIds.map(id => ({ id }));

		const values = await this.optionValueRepo.find({
			where: findOpt,
			relations: { option: true },
		});
		return values;
	}

	async byId(id: number) {
		const option = await this.optionRepo.findOne({
			where: { id },
			relations: {
				values: true,
			},
		});

		if (!option) throw new BadRequestException('Опции не существует!');
		return option;
	}
}
