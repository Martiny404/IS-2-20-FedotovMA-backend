import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Res,
	Req,
	Delete,
	Query,
} from '@nestjs/common';
import { Response } from 'express';
import { CheckAuth } from 'src/decorators/auth.decorator';
import { addOptionsToProductDto } from './dto/add-options.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { RateProductDto } from './dto/rate-product.dto';
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

	@Delete('/delete-options/:id')
	async deleteOptions(@Param('id') id: string, @Body('keys') keys: string[]) {
		return this.productService.deleteOptions(+id, keys);
	}

	@CheckAuth('user', true)
	@Post('/rate-product')
	async evaluteProduct(@Body() dto: RateProductDto, @Req() req) {
		const userId = req.user.id;
		return this.productService.evaluteProduct(userId, dto.productId, dto.rate);
	}

	@Get('/rate-product/:id')
	async getAverageRate(@Param('id') id: string) {
		return this.productService.getAverageRate(+id);
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
