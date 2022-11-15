import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateOrderCode } from 'src/utils/generateOrderCode';
import { Repository } from 'typeorm';
import { OrderProduct } from './entities/order-product.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
	constructor(
		@InjectRepository(Order) private readonly orderRepo: Repository<Order>,
		@InjectRepository(OrderProduct)
		private readonly orderProductRepo: Repository<OrderProduct>
	) {}

	async createOrder(userId: number, productIds: number[]) {
		const code = generateOrderCode();
	}
}
