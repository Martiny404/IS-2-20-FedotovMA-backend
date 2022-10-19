import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddOptionValues } from './dto/add-option-values.dto';
import { OptionService } from './option.service';

@Controller('option')
export class OptionController {
	constructor(private readonly optionService: OptionService) {}

	@Post('/')
	async create(@Body() opt: { name: string; categories: number[] }) {
		return this.optionService.create(opt.name, opt.categories);
	}

	@Post('/add-values')
	async addOptionValue(@Body() dto: AddOptionValues) {
		return this.optionService.addOptionValues(dto.optionId, dto.values);
	}

	@Get('/:id')
	async byId(@Param('id') id: string) {
		return this.optionService.byId(Number(id));
	}
}
