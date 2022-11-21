import { FindOperator } from 'typeorm';

export type DateFilter = {
	createdAt: FindOperator<string>;
} | null;
