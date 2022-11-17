import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';

import { generateOrderCode } from 'src/utils/generateOrderCode';
import { parseOrderDate } from 'src/utils/parseOrderDate';
import { Repository } from 'typeorm';
import { OrderProductDto } from './dto/create-order.dto';
import { OrderProduct } from './entities/order-product.entity';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrderService {
	constructor(
		@InjectRepository(Order) private readonly orderRepo: Repository<Order>,
		@InjectRepository(OrderProduct)
		private readonly orderProductRepo: Repository<OrderProduct>,
		private readonly mailService: MailService,
		private readonly userService: UserService,
		private readonly productService: ProductService
	) {}

	async createOrder(userId: number, orderProductsDto: OrderProductDto[]) {
		try {
			const code = generateOrderCode();
			const order_date = parseOrderDate();
			const user = await this.userService.byId(userId);
			if (!user) {
				throw new NotFoundException(
					'Пользователь не найден, ошибка при создании заказа!'
				);
			}
			const order = this.orderRepo.create({
				activation_code: code,
				user: { id: user.id },
				order_date,
			});

			await this.orderRepo.save(order);

			const orderProducts = await Promise.all(
				orderProductsDto.map(op => {
					try {
						const orderProduct = this.orderProductRepo.create({
							order: { id: order.id },
							product: { id: op.productId },
							price: op.price,
							quantity: op.quantity,
						});
						return this.orderProductRepo.save(orderProduct);
					} catch (e) {
						this.orderRepo.delete({ id: order.id });
						throw new BadRequestException('Ошибка при создании заказа');
					}
				})
			);
			order.orderProducts = orderProducts;
			await this.mailService.activeOrderMail(
				user.email,
				order.activation_code,
				order.id
			);
			await this.orderRepo.save(order);
			await this.userService.removeSeveralProductsFromBasket(
				user.id,
				order.orderProducts
			);
			await this.productService.reduceSeveralQuantity(order.orderProducts);
			return order;
		} catch (e) {
			throw e;
		}
	}

	async getOrder(id: number) {
		try {
			const order = await this.orderRepo.findOne({
				where: { id },
				relations: {
					orderProducts: { product: { category: true, brand: true } },
					user: true,
				},
			});

			if (!order) {
				throw new NotFoundException('Заказ не найден!');
			}

			return order;
		} catch (e) {
			throw e;
		}
	}

	async activateOrder(userId: number, orderId: number, code: string) {
		try {
			const order = await this.orderRepo.findOne({
				where: {
					user: { id: userId },
					id: orderId,
					activation_code: code,
				},
			});
			if (!order) {
				return false;
			}
			order.orderStatus = OrderStatus.WAITING_FOR_PAYMENT_OR_RECEIPT;
			order.is_activated = true;
			await this.orderRepo.save(order);
			return true;
		} catch (e) {
			throw e;
		}
	}

	async removeOrder(orderId: number) {
		try {
			const order = await this.getOrder(orderId);
			await this.orderRepo.remove(order);
			return true;
		} catch (e) {
			throw e;
		}
	}
}
