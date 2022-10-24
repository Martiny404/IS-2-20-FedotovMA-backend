import { IsString } from 'class-validator';
import { ProductStatus } from '../product.entity';

export class updateProductDto {
	@IsString()
	name: string;

	status?: ProductStatus;

	price?: number;

	discount_percentage?: number;

	categoryId?: number;

	brandId?: number;

	valuesIds?: number[];
}
