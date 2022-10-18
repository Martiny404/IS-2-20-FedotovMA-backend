import { Body, Controller, Post } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';

@Controller('brand')
export class BrandController {
	constructor(private readonly brandService: BrandService) {}
	@Post('/')
	async create(@Body() dto: CreateBrandDto) {
		const brand = await this.brandService.create(dto);
		return brand;
	}
}
