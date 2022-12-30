import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateOptionDto } from './dto/createOptionDto';
import { OptionService } from './option.service';

@Controller('option')
export class OptionController {
	constructor(private readonly optionService: OptionService) {}

	@Get('/')
	async getAll() {
		return this.optionService.getAll();
	}
	@Post('/')
	async create(@Body() opt: CreateOptionDto) {
		return this.optionService.create(opt);
	}

	@Post('/add-values/:id')
	async addOptionValue(@Param('id') id: string, @Body('value') value: string) {
		return this.optionService.addOptionValues(+id, value);
	}

	@Get('/:id')
	async byId(@Param('id') id: string) {
		return this.optionService.byId(+id);
	}

	@Delete('/remove/:id')
	async removeOption(@Param('id') id: string) {
		return this.optionService.removeOption(+id);
	}

	@Delete('/remove-value/:id')
	async removeValue(@Param('id') id: string) {
		return this.optionService.removeValue(+id);
	}
}
