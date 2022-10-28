import { Body, Controller, Patch, Post } from '@nestjs/common';
import { BrandService } from './brand.service';
import { AddCategoryDto } from './dto/add-categories.dto';
import { CreateBrandDto } from './dto/create-brand.dto';

@Controller('brand')
export class BrandController {
	constructor(private readonly brandService: BrandService) {}
	@Post('/')
	async create(@Body() dto: CreateBrandDto) {
		const brand = await this.brandService.create(dto);
		return brand;
	}

	@Patch('/add-category')
	async addCategories(@Body() dto: AddCategoryDto) {
		return this.brandService.addCategory(dto.brandId, dto.categoryId);
	}
}
