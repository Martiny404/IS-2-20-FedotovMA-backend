import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { addOptionsToProductDto } from './dto/add-options.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { updateProductDto } from './dto/update-product.dto';
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

	@Patch('/:id')
	async addOptions(
		@Param('id') id: string,
		@Body() dto: addOptionsToProductDto
	) {
		return this.productService.addOptions(+id, dto);
	}

	@Post('/toggle-hidden/:id')
	async toggleHidden(@Param('id') id: string, @Res() res: Response) {
		const prod = await this.productService.toggleHidden(+id);
		res.status(200).json(prod);
	}

	@Patch('/update/:id')
	async update(
		@Param('id') id: string,
		@Body() dto: updateProductDto,
		@Res() res: Response
	) {
		const prod = await this.productService.update(+id, dto);
		res.status(200).json(prod);
	}
}
