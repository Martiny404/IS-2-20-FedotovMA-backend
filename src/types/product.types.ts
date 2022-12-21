type Options = Object & Record<string, any>;

export interface Category {
	id: number;
	name: string;
	description?: string;
	categoryImgPath?: string;
}

export interface Brand {
	id: number;
	name: string;
	description?: string;
	brandImgPath: string;
}

export interface IProduct {
	id: number;
	createdAt: string;
	updatedAt: string;
	name: string;
	inStock: number;
	views: number;
	description: string;
	status: string;
	hidden: boolean;
	price: number;
	discount_percentage?: number;
	poster: string;
	options: Options;
	category: Category;
	brand: Brand;
}

export interface AllProductsReponse {
	count: number;
	products: IProduct[];
}
