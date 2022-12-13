import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { countOrderTotal } from 'src/utils/countOrderTotal';

import { generateCode } from 'src/utils/generateCode';
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

	async getAll() {
		return this.orderRepo.find({
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
	}

	async createOrder(userId: number, orderProductsDto: OrderProductDto[]) {
		const order_date = parseOrderDate();
		const user = await this.userService.byId(userId);
		if (!user) {
			throw new NotFoundException(
				'Пользователь не найден, ошибка при создании заказа!'
			);
		}
		const order = this.orderRepo.create({
			user: { id: user.id },
			order_date,
		});
		await this.orderRepo.save(order);

		const orderProducts = orderProductsDto.map(op => {
			const orderProduct = this.orderProductRepo.create({
				order: { id: order.id },
				product: { id: op.productId },
				quantity: op.quantity,
			});
			return orderProduct;
		});

		await this.orderProductRepo.save(orderProducts);

		const prods = await Promise.all(
			orderProducts.map(async op => {
				const product = await this.productService.byId(op.product.id);
				return {
					quantity: op.quantity,
					price: product.price,
					discount: product.discount_percentage,
				};
			})
		);

		const total = countOrderTotal(prods);

		order.total = total;

		await this.orderRepo.save(order);

		try {
			await this.userService.removeSeveralProductsFromBasket(
				user.id,
				orderProducts
			);
		} catch (e) {
			await this.orderRepo.delete({ id: order.id });
			throw e;
		}
		return order;
	}

	async sendValidationCode(userId: number, orderId: number) {
		const order = await this.orderRepo.findOne({
			where: {
				id: orderId,
				user: {
					id: userId,
				},
			},
			relations: { user: true },
		});
		if (!order) {
			throw new NotFoundException('Заказ не найден!');
		}
		const code = generateCode();
		order.activation_code = code;
		this.orderRepo.save(order);
		await this.mailService.activeOrderMail(
			order.user.email,
			order.activation_code,
			order.id
		);
	}

	async getOrder(id: number, userId: number) {
		const order = await this.orderRepo.findOne({
			where: { id, user: { id: userId } },
			relations: {
				orderProducts: { product: { category: true, brand: true } },
				user: true,
			},
		});

		if (!order) {
			throw new NotFoundException('Заказ не найден!');
		}

		return order;
	}

	async getOrderInfo(id: number) {
		const order = await this.orderRepo.findOne({
			where: { id },
			relations: {
				orderProducts: {
					product: {
						category: true,
						brand: true,
					},
				},
				user: true,
			},
			select: {
				is_activated: true,
				createdAt: true,
				id: true,
				total: true,
				order_date: true,
				orderStatus: true,
				orderProducts: {
					product: {
						brand: {
							id: true,
							name: true,
							brandImgPath: true,
						},
						category: {
							id: true,
							name: true,
							categoryImgPath: true,
						},
						name: true,
						inStock: true,
						id: true,
						status: true,
						price: true,
						poster: true,
						discount_percentage: true,
					},
					quantity: true,
				},
			},
		});
		if (!order) {
			throw new NotFoundException('Заказа не существует!');
		}
		return order;
	}

	async activateOrder(userId: number, orderId: number, code: string) {
		const order = await this.orderRepo.findOne({
			where: {
				user: { id: userId },
				id: orderId,
				activation_code: code,
			},
			relations: { orderProducts: { product: true } },
		});
		if (!order) {
			return false;
		}
		await this.productService.reduceSeveralQuantity(order.orderProducts);
		order.orderStatus = OrderStatus.WAITING_FOR_PAYMENT_OR_RECEIPT;
		order.is_activated = true;
		order.activation_code = null;
		await this.orderRepo.save(order);
		return true;
	}

	async removeOrder(userId: number, orderId: number) {
		const order = await this.getOrder(userId, orderId);
		await this.productService.returnSeveralProductsFromOrder(
			order.orderProducts
		);
		await this.orderRepo.remove(order);
		return true;
	}

	async cancleOrder(userId: number, orderId: number) {
		const order = await this.getOrder(userId, orderId);
		await this.productService.returnSeveralProductsFromOrder(
			order.orderProducts
		);
		order.orderStatus = OrderStatus.CANCELLED;
		return this.orderRepo.save(order);
	}
}
