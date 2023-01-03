import { IsNumber } from 'class-validator';

export class addOptionsToProductDto {
	@IsNumber()
	optionId: number;
	@IsNumber()
	optionValueId: number;
}
