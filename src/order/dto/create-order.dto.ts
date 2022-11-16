export class OrderProductDto {
	quantity: number;
	price: number;
	productId: number;
}

export class CreateOrderDto {
	orderProducts: OrderProductDto[];
}
