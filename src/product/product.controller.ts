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
	UseFilters,
} from '@nestjs/common';
import { Response } from 'express';
import { CheckAuth } from 'src/decorators/auth.decorator';
import { HttpExceptionFilter } from 'src/global-filters/http-exception.filter';
import { addOptionsToProductDto } from './dto/add-options.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { updateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

//@UseFilters(HttpExceptionFilter)
@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@CheckAuth('admin', true)
	@Post('/')
	async create(@Body() dto: CreateProductDto) {
		const product = await this.productService.create(dto);
		return product;
	}

	@Get('/')
	async getCatalog(@Query() query) {
		const categoryId = query.categoryId ? +query.categoryId : undefined;
		const brandId = query.brandId ? +query.brandId : undefined;
		const page = query.page ? +query.page : undefined;
		const filters = query.filters ? JSON.parse(query.filters) : [];

		return await this.productService.getCatalog(
			categoryId,
			page,
			brandId,
			filters
		);
	}

	@Get('/all')
	async getAll() {
		return this.productService.all();
	}

	@Get('/search')
	async search(@Query('searchTerm') searchTerm: string) {
		return this.productService.search(searchTerm);
	}

	@Post('/views/:id')
	async incrementViews(@Param('id') id: string) {
		return this.productService.incrementViews(+id);
	}

	@CheckAuth('user')
	@Get('/user-product-rate/:id')
	async getUserProductRate(@Param('id') id: string, @Req() req) {
		const userId = req.user.id;
		return this.productService.getUserProdcutRate(userId, +id);
	}

	@Get('/info/:id')
	async getProductInfo(@Param('id') id: string) {
		return this.productService.getProductInfo(+id);
	}

	@CheckAuth('admin', true)
	@Patch('/add-option/:id')
	async addOptions(
		@Param('id') id: string,
		@Body() dto: addOptionsToProductDto
	) {
		return this.productService.addOptions(+id, dto);
	}

	@CheckAuth('admin', true)
	@Delete('/remove/:id')
	async deleteProduct(@Param('id') id: string) {
		return this.productService.deleteProduct(+id);
	}

	@CheckAuth('admin', true)
	@Patch('/add-img/:id')
	async addImage(@Param('id') id: string, @Body('path') path: string) {
		return this.productService.addImage(path, +id);
	}

	@CheckAuth('admin', true)
	@Delete('/remove-img/:id')
	async removeImage(@Param('id') id: string) {
		return this.productService.deleteImage(+id);
	}

	@CheckAuth('admin', true)
	@Patch('/delete-options/:id')
	async deleteOptions(@Param('id') id: string, @Body('key') key: string) {
		return this.productService.deleteOptions(+id, key);
	}

	@CheckAuth('user', true)
	@Post('/evalute-product/:id')
	async evaluteProduct(
		@Param('id') id: string,
		@Body('rate') rate: number,
		@Req() req
	) {
		const userId = req.user.id;
		return this.productService.evaluteProduct(userId, +id, rate);
	}

	@Get('/rate-product/:id')
	async getAverageRate(@Param('id') id: string) {
		return this.productService.getAverageRate(+id);
	}

	@CheckAuth('admin', true)
	@Patch('/update/:id')
	async update(@Param('id') id: string, @Body() dto: updateProductDto) {
		return this.productService.update(+id, dto);
	}

	@Get('/with-discount/:categoryId')
	async getProductsWithDiscountByCategory(
		@Param('categoryId') categoryId: string
	) {
		return this.productService.getProductsWithDiscountByCategory(+categoryId);
	}

	@Get('/with-discount/:brandId')
	async getProductsWithDiscountByBrand(@Param('brandId') brandId: string) {
		return this.productService.getProductsWithDiscountByBrand(+brandId);
	}
}
