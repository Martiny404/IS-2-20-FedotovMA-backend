import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateOfferDto {
	@IsOptional()
	@IsNumber()
	@IsPositive()
	categoryId: number;

	@IsOptional()
	@IsNumber()
	@IsPositive()
	brandId: number;

	@IsOptional()
	@IsString()
	description: string;

	@IsOptional()
	@IsString()
	endDate: string;

	@IsOptional()
	@IsString()
	photo: string;
}
