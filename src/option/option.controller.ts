import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddOptionValues } from './dto/add-option-values.dto';
import { CreateOptionDto } from './dto/createOptionDto';
import { OptionService } from './option.service';

@Controller('option')
export class OptionController {
	constructor(private readonly optionService: OptionService) {}

	@Post('/')
	async create(@Body() opt: CreateOptionDto) {
		return this.optionService.create(opt);
	}

	@Post('/add-values')
	async addOptionValue(@Body() dto: AddOptionValues) {
		return this.optionService.addOptionValues(dto.optionId, dto.value);
	}

	@Get('/:id')
	async byId(@Param('id') id: string) {
		return this.optionService.byId(Number(id));
	}
}
