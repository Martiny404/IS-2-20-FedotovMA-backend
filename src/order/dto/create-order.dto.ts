export class OrderProductDto {
	quantity: number;
	productId: number;
}

export class CreateOrderDto {
	orderProducts: OrderProductDto[];
}
