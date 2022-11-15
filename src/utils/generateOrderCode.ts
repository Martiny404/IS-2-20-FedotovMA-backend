export const generateOrderCode = () =>
	Number(
		Math.floor(Math.random() * 1000000)
			.toString()
			.padStart(6, '0')
	);
