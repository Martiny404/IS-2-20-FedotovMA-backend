import { ISortBy, ISortType } from 'src/types/producr-filter.types';

interface ToNumberOptions {
	default?: number;
	min?: number;
	max?: number;
}

export function toLowerCase(value: string): string {
	return value.toLowerCase();
}

export function trim(value: string): string {
	return value.trim();
}

export function JsonTransform(value: string) {
	if (value == '') {
		return [];
	}
	try {
		const parsed = JSON.parse(value);
		return parsed;
	} catch (e) {
		return [];
	}
}

export function toDate(value: string): Date {
	return new Date(value);
}

export function toISortType(value: ISortType) {
	if (Object.values(ISortType).includes(value)) {
		return value;
	}
	return ISortType.ASC;
}

export function toISortBy(value: ISortBy) {
	if (Object.values(ISortBy).includes(value)) {
		return value;
	}
	return ISortBy.VIEWS;
}

export function toBoolean(value: string): boolean {
	value = value.toLowerCase();

	return value === 'true' || value === '1' ? true : false;
}

export function toNumber(value: string, opts: ToNumberOptions = {}): number {
	let newValue: number = Number.parseInt(value || String(opts.default), 10);

	if (Number.isNaN(newValue)) {
		newValue = opts.default;
	}

	if (opts.min) {
		if (newValue < opts.min) {
			newValue = opts.min;
		}

		if (newValue > opts.max) {
			newValue = opts.max;
		}
	}

	return newValue;
}
