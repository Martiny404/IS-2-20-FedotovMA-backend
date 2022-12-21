interface ICounterTotal {
	quantity: number;
	price: number;
	discount: number;
}

export function countOrderTotal(prods: ICounterTotal[]): number {
	let total: number = 0;

	for (const item of prods) {
		if (item.discount != 0) {
			const singlePrice = item.price - item.price * (item.discount / 100);
			const result = singlePrice * item.quantity;
			total += result;
		} else {
			total += item.price * item.quantity;
		}
	}

	return total;
}
