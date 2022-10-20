import { IsArray, IsNumber } from 'class-validator';

export class addOptionsToProductDto {
	@IsArray()
	@IsNumber({}, { each: true })
	valuesIds: number[];
}
