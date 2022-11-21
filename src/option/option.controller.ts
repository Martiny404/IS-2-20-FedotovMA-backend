import { Body, Controller, Get, Param, Post, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/global-filters/http-exception.filter';
import { AddOptionValues } from './dto/add-option-values.dto';
import { CreateOptionDto } from './dto/createOptionDto';
import { OptionService } from './option.service';

@UseFilters(HttpExceptionFilter)
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
