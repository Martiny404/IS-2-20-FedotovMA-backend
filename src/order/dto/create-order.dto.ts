export class OrderProductDto {
	quantity: number;
	price: number;
	productId: number;
	discount: number;
}

export class CreateOrderDto {
	orderProducts: OrderProductDto[];
}
