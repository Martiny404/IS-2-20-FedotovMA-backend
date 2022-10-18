import { Body, Controller, Post } from '@nestjs/common';
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
}
