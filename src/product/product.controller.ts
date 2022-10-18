import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}
	@Post('/')
	async create(@Body() dto: CreateProductDto) {
		const product = await this.productService.create(dto);
		return product;
	}
	@Get(':id')
	async byId(@Param('id') id: string) {
		return await this.productService.byId(+id);
	}
}
