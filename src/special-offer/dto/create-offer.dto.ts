import {
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	Max,
} from 'class-validator';

export class CreateOffer {
	@IsNumber()
	@IsPositive()
	categoryId: number;

	@IsNumber()
	@IsPositive()
	brandId: number;

	@IsOptional()
	@IsString()
	description: string;

	@IsString()
	endDate: string;

	@IsNumber()
	@IsPositive()
	@Max(95)
	discount: number;

	@IsString()
	photo: string;
}
