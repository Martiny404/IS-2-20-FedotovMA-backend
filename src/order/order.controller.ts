import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Req,
	UseFilters,
} from '@nestjs/common';
import { CheckAuth } from 'src/decorators/auth.decorator';
import { HttpExceptionFilter } from 'src/global-filters/http-exception.filter';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@UseFilters(HttpExceptionFilter)
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
	@Post('/activate/:id')
	async activateOrder(
		@Param('id') id: string,
		@Body('code') code: string,
		@Req() req
	) {
		const userId = req.user.id;
		return this.orderService.activateOrder(userId, +id, code);
	}

	@CheckAuth('user', true)
	@Get('/:id')
	async getOrder(@Param('id') id: string, @Req() req) {
		const userId = req.user.id;
		return this.orderService.getOrder(userId, +id);
	}

	@CheckAuth('user', true)
	@Delete('/cancellation/:id')
	async orderCancellation(@Param('id') id: string, @Req() req) {
		const userId = req.user.id;
		return this.orderService.removeOrder(userId, +id);
	}
}
