import { OrderProduct } from 'src/order/entities/order-product.entity';

export function countOrderTotal(orderProducts: OrderProduct[]): number {
	const total = orderProducts.reduce((acc, item) => {
		if (item.discount) {
			const price = item.price - item.price * (item.discount / 100);
			return (acc += price);
		}
	}, 0);
	return total;
}
