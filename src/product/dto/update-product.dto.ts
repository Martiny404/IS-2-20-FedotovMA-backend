import { IsString } from 'class-validator';
import { ProductStatus } from '../entities/product.entity';

export class updateProductDto {
	@IsString()
	name: string;

	status?: ProductStatus;

	price?: number;

	discount_percentage?: number;

	categoryId?: number;

	brandId?: number;
}
