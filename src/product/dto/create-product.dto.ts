import {
	IsArray,
	IsNumber,
	IsPositive,
	IsString,
	Length,
	Max,
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
}
