export function parseOrderDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth();
	const day = today.getDate() + 3;
	const hours = 20;
	const mins = 0;
	const secs = 0;
	const orderDate = `${year}-${month}-${day}-${hours}-${mins}-${secs}`;
	return orderDate;
}
