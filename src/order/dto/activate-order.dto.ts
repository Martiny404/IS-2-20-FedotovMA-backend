import { IsNumber, IsPositive, IsString, Length } from 'class-validator';

export class ActivateOrderDto {
	@IsPositive()
	@IsNumber()
	userId: number;

	@IsPositive()
	@IsNumber()
	orderId: number;

	@IsString()
	@Length(6, 6)
	code: string;
}
