import { Body, Controller, Get, Param, Post, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/global-filters/http-exception.filter';
import { CategoryService } from './category.service';
import { AddOptionDto } from './dto/add-option.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@UseFilters(HttpExceptionFilter)
@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Post()
	async create(@Body() dto: CreateCategoryDto) {
		const category = await this.categoryService.create(dto);
		return category;
	}

	@Get('/all-options:/id')
	async getAllOptions(@Param('id') id: string) {
		return this.categoryService.getAllOptions(+id);
	}

	@Post('/add-options')
	async addOption(@Body() dto: AddOptionDto) {
		return this.categoryService.addOption(dto.categoryId, dto.optionId);
	}

	@Get('/:name')
	async byName(@Param('name') name: string) {
		return this.categoryService.byName(name);
	}
}
