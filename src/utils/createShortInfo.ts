import { OptionValue } from 'src/option/entities/option-value.entity';

export function createShortInfo(values: OptionValue[]): string | null {
	if (values.length < 0) return null;

	const cache: Record<string, string[]> & Object = {};

	for (const value of values) {
		const key = value.option.optionName;
		if (!cache.hasOwnProperty(key)) {
			cache[key] = [value.value];
		} else {
			cache[key].push(value.value);
		}
	}

	let shortInfo = '';

	Object.keys(cache).forEach(key => {
		shortInfo += `${key}: ` + `(${cache[key].join(',')});`;
	});
	return shortInfo;
}
