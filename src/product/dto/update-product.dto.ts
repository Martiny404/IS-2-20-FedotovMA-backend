import {
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	Length,
	Max,
	Min,
} from 'class-validator';
import { ProductStatus } from '../entities/product.entity';

export class updateProductDto {
	@IsOptional()
	@IsString()
	@Length(5, 40, { message: 'Название должно быть от 5 до 40 символов' })
	name: string;

	@IsOptional()
	status: ProductStatus;

	@IsOptional()
	@IsString()
	description: string;

	@IsOptional()
	@IsNumber()
	@IsPositive()
	inStock: number;

	@IsOptional()
	@IsNumber()
	@IsPositive()
	@Max(120_000_00000)
	price: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(99)
	discount_percentage: number;

	@IsString()
	@IsOptional()
	poster: string;
}
