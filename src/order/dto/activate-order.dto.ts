import { IsNumber, IsPositive, IsString, Length } from 'class-validator';

export class ActivateOrderDto {
	@IsString()
	@Length(6, 6)
	code: string;
}
