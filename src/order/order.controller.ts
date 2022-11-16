import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { CheckAuth } from 'src/decorators/auth.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}
	@CheckAuth('user', true)
	@Post('/')
	async createOrder(@Req() req, @Body() dto: CreateOrderDto) {
		const userId = req.user.id;
		return this.orderService.createOrder(userId, dto.orderProducts);
	}

	@CheckAuth('user', true)
	@Get('/:id')
	async getOrder(@Param('id') id: string) {
		return this.orderService.getOrder(+id);
	}
}
