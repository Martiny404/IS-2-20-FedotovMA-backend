export function parseFilterDate(
	d: string,
	flag: 'start' | 'end' = 'start'
): Date {
	const nums = d
		.split('-')
		.map(Number)
		.map((item, idx) => {
			if (idx == 1) {
				return item - 1;
			}
			return item;
		});

	if (flag == 'start') {
		const date = new Date(nums[0], nums[1], nums[2], 0, 0, 0);
		return date;
	} else {
		const date = new Date(nums[0], nums[1], nums[2], 23, 59, 59);
		return date;
	}
}
