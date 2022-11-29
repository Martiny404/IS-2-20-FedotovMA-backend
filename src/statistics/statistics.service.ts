import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from 'src/order/entities/order-product.entity';
import { Order } from 'src/order/entities/order.entity';
import { ProductService } from 'src/product/product.service';
import { DateFilter } from 'src/types/dateFilter.type';
import { Between, Repository } from 'typeorm';

@Injectable()
export class StatisticsService {
	constructor(
		@InjectRepository(OrderProduct)
		private readonly orderProductRepo: Repository<OrderProduct>,
		@InjectRepository(Order) private readonly orderRepo: Repository<Order>
	) {}

	async countOrdersProducts(category?: string, brand?: string) {
		const query = this.orderProductRepo
			.createQueryBuilder('s')
			.select([
				'COUNT(*) as c',
				'AVG(r.rate) as rating',
				'p.name as name',
				'p.id as id',
				'p.created_at',
				'p.options as options',
				'p.price as price',
				'p.discount_percentage as discount_percentage',
				'p.poster as poster',
				'cat.name as category_name',
				'b.name as brand_name',
			])
			.innerJoin('s.product', 'p')
			.innerJoin('p.category', 'cat')
			.innerJoin('p.brand', 'b')
			.innerJoin('p.rating', 'r')
			.groupBy('p.id, cat.id, b.id');

		if (category) {
			query.where('cat.name =:cat', { cat: category });
		}
		if (brand) {
			query.andWhere('b.name =:brand', { brand: brand });
		}

		const data = await query.getRawMany();

		return data;
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
					discount: true,
					quantity: true,
					price: true,
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
