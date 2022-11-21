import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from 'src/order/entities/order-product.entity';
import { Order } from 'src/order/entities/order.entity';
import { DateFilter } from 'src/types/dateFilter.type';
import { parseFilterDate } from 'src/utils/parseFilterDate';
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
			.select(['COUNT(*) as c', 'p.name as product_name', 'p.id as product_id'])
			.innerJoin('s.product', 'p')
			.innerJoin('p.category', 'cat')
			.innerJoin('p.brand', 'b')
			.groupBy('p.id')
			.orderBy('c', 'DESC');
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
