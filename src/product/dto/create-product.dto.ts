import {
	IsArray,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	Length,
	Max,
	Min,
} from 'class-validator';

export class CreateProductDto {
	@IsString()
	@Length(5, 40, { message: 'Название должно быть от 5 до 40 символов' })
	name: string;

	@IsNumber()
	@IsPositive()
	@Max(120_000_00000)
	price: number;

	@IsNumber()
	@IsPositive()
	categoryId: number;

	@IsNumber()
	@IsPositive()
	brandId: number;

	@IsString()
	poster: string;

	@IsNumber()
	@IsPositive()
	inStock: number;

	@IsNumber()
	@Min(0)
	@Max(99)
	discount_percentage: number;

	@IsString()
	description: string;
}
