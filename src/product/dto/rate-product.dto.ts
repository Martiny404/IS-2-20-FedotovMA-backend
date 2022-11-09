import { Max, Min } from 'class-validator';

export class RateProductDto {
	productId: number;

	@Max(5)
	@Min(1)
	rate: number;
}
