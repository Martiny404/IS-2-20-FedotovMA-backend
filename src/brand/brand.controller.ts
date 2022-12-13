import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/global-filters/http-exception.filter';
import { BrandService } from './brand.service';
import { AddCategoryDto } from './dto/add-categories.dto';
import { CreateBrandDto } from './dto/create-brand.dto';

@UseFilters(HttpExceptionFilter)
@Controller('brand')
export class BrandController {
	constructor(private readonly brandService: BrandService) {}

	@Get('/all')
	async getAll() {
		return this.brandService.getAll();
	}
	@Get('/:id')
	async byId(@Param('id') id: string) {
		return this.brandService.byId(+id);
	}

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
