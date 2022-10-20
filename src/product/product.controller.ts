import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { addOptionsToProductDto } from './dto/add-options.dto';
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
	@Get('/')
	async getAll() {
		return await this.productService.all();
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: addOptionsToProductDto) {
		return this.productService.update(+id, dto);
	}

	@Post('/toggle-hidden/:id')
	async toggleHidden(@Param('id') id: string) {
		return this.productService.toggleHidden(+id);
	}
}
