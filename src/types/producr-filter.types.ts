export interface IFilter {
	key: string;
	value: any[];
}

export enum ISortBy {
	PRICE = 'price',
	VIEWS = 'views',
	OFFERS = 'productOrders',
}
export enum ISortType {
	ASC = 'asc',
	DESC = 'desc',
}
