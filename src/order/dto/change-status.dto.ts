import { IsEnum } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class ChangeStatusDto {
	@IsEnum(OrderStatus, { message: 'Тип статуса не существует!' })
	status: OrderStatus;
}
