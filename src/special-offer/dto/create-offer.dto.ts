import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

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

	@IsString()
	photo: string;
}
