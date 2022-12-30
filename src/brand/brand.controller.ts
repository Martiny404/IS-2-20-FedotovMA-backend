import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

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

	@Get('/info/:id')
	async getBrandInfo(@Param('id') id: string) {
		return this.brandService.getBrandInfo(+id);
	}

	@Post('/')
	async create(@Body() dto: CreateBrandDto) {
		return await this.brandService.create(dto);
	}

	@Patch('/update/:id')
	async update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
		return await this.brandService.update(+id, dto);
	}

	@Delete('/remove/:id')
	async remove(@Param('id') id: string) {
		return this.brandService.remove(+id);
	}

	@Patch('/add-category/:id')
	async addCategories(
		@Param('id') id: string,
		@Body('categoryId') categoryId: number
	) {
		return this.brandService.addCategory(+id, categoryId);
	}

	@Patch('/remove-category-brand/:id')
	async removeCategoryBrand(
		@Param('id') id: string,
		@Body('categoryId') categoryId: number
	) {
		return this.brandService.removeCategory(+id, categoryId);
	}
}
