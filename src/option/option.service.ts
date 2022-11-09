import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionValue } from './entities/option-value.entity';
import { Repository } from 'typeorm';
import { Option } from './entities/option.entity';
import { CreateOptionDto } from './dto/createOptionDto';

@Injectable()
export class OptionService {
	constructor(
		@InjectRepository(Option) private readonly optionRepo: Repository<Option>,
		@InjectRepository(OptionValue)
		private readonly optionValueRepo: Repository<OptionValue>
	) {}

	async create(opt: CreateOptionDto) {
		const isOptExist = await this.optionRepo.findOne({
			where: { optionName: opt.name },
		});

		if (isOptExist) {
			throw new BadRequestException('Такая характеристика уже есть!');
		}

		const option = this.optionRepo.create({ optionName: opt.name });

		return await this.optionRepo.save(option);
	}

	async addOptionValues(optionId: number, value: string) {
		try {
			const option = await this.byId(optionId);

			const optionValue = this.optionValueRepo.create({
				value,
			});

			option.values = [...option.values, optionValue];

			return await this.optionRepo.save(option);
		} catch (e) {
			throw e;
		}
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
