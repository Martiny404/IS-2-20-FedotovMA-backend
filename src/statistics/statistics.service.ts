import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from 'src/order/entities/order-product.entity';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { DateFilter } from 'src/types/dateFilter.type';
import { Between, Repository } from 'typeorm';

@Injectable()
export class StatisticsService {
	constructor(
		@InjectRepository(Order)
		private readonly orderRepo: Repository<Order>,
		@InjectRepository(Product) private readonly productRepo: Repository<Product>
	) {}

	async countOrdersProducts(category?: string, brand?: string) {
		let queryString = `
		SELECT DISTINCT ON (product.id) product.name as product_name, product.status as product_status, product.updated_at, product.created_at, product.views, product.in_stock, product.poster, product.price, product.description,product."options", product.discount_percentage, product.id as id,  brand.name as brand_name, category.name as category_name, brand.id as brand_id, category.id as category_id, count(order_product.product_id)AS c, AVG(rating.rate) as rating FROM product
		LEFT JOIN order_product on order_product.product_id = product.id
		LEFT JOIN brand on brand."id" = product.brand_id
		LEFT JOIN rating on product."id" = rating.product_id
		LEFT JOIN category on category."id" = product.category_id
		GROUP BY product.id, category.id, brand.id, rating.id
		`;
		if (category && !brand) {
			queryString += ` HAVING category.name = ${category};`;
		}
		if (!category && brand) {
			queryString += ` HAVING brand.name = ${brand};`;
		}
		if (brand && category) {
			queryString += `	HAVING brand.name = ${brand} AND  category.name = ${category}`;
		}
		queryString += ' LIMIT 9';
		const q = await this.productRepo.query(queryString);
		return q.sort((a: any, b: any) => b.c - a.c);
	}

	async getOrdersByDateRange(start?: string, end?: string) {
		const s = `${start} 00:00:00`;
		const e = `${end} 23:59:59`;

		const filters: DateFilter =
			start && end ? { createdAt: Between(s, e) } : null;

		const orders = await this.orderRepo.find({
			where: filters,
			relations: {
				user: true,
				orderProducts: { product: { brand: true, category: true } },
			},
			select: {
				id: true,
				createdAt: true,
				orderStatus: true,
				is_activated: true,
				total: true,
				user: {
					id: true,
					email: true,
				},
				orderProducts: {
					quantity: true,
					product: {
						name: true,
						inStock: true,
						category: { name: true },
						brand: { name: true },
					},
				},
			},
		});
		return orders;
	}
}
