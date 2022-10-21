import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { get } from 'http';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}
	@Post('/')
	async create(@Body() dto: CreateCategoryDto) {
		const category = await this.categoryService.create(dto);
		return category;
	}

	@Get('/all-options')
	async getAllOptions() {
		return this.categoryService.getAllOptions();
	}

	@Get('/:name')
	async byName(@Param('name') name: string) {
		return this.categoryService.byName(name);
	}
}
