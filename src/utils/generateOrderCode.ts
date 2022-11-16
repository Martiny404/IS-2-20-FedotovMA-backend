export const generateOrderCode = () =>
	Math.floor(Math.random() * 1000000)
		.toString()
		.padStart(6, '0');
