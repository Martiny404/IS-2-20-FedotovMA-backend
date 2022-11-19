import { OrderProduct } from 'src/order/entities/order-product.entity';

export function countOrderTotal(orderProducts: OrderProduct[]): number {
	const total = orderProducts.reduce((acc, item) => {
		if (item.discount) {
			const singlePrice = item.price - item.price * (item.discount / 100);
			const multiPrice = singlePrice * item.quantity;
			return (acc += multiPrice);
		}
	}, 0);
	return total;
}
