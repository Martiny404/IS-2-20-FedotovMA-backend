import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Req,
} from '@nestjs/common';
import { CheckAuth } from 'src/decorators/auth.decorator';
import { ActivateOrderDto } from './dto/activate-order.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@CheckAuth('admin', true)
	@Get('/all')
	async getAll() {
		return this.orderService.getAll();
	}

	@CheckAuth('admin', true)
	@Get('/info/:id')
	async getOrderInfo(@Param('id') id: string) {
		return this.orderService.getOrderInfo(+id);
	}

	@CheckAuth('user', true)
	@Post('/')
	async createOrder(@Req() req, @Body() dto: CreateOrderDto) {
		const userId = req.user.id;
		return this.orderService.createOrder(userId, dto.orderProducts);
	}

	@CheckAuth('user', true)
	@Post('/send-code/')
	async sendActivationCode(@Body('orderId') orderId: number, @Req() req) {
		const userId = req.user.id;
		return this.orderService.sendValidationCode(userId, orderId);
	}

	@CheckAuth('user', true)
	@Post('/activate')
	async activateOrder(@Body() dto: ActivateOrderDto, @Req() req) {
		const userId = req.user.id;
		return this.orderService.activateOrder(userId, dto.orderId, dto.code);
	}

	@CheckAuth('user', true)
	@Get('/:id')
	async getOrder(@Param('id') id: string, @Req() req) {
		const userId = req.user.id;
		return this.orderService.getOrder(userId, +id);
	}

	@CheckAuth('admin', true)
	@Delete('/remove/:id')
	async removeOrder(@Param('id') id: string) {
		return this.orderService.removeOrder(+id);
	}

	@CheckAuth('admin', true)
	@Patch('/change-status/:id')
	async changeStatus(@Param('id') id: string, @Body() dto: ChangeStatusDto) {
		return this.orderService.changeStatus(+id, dto.status);
	}

	@CheckAuth('admin', true)
	@Patch('/toggle-active/:id')
	async toggleActive(@Param('id') id: string) {
		return this.orderService.toggleActive(+id);
	}

	@CheckAuth('user', true)
	@Patch('/cancle/:id')
	async cancleOrder(@Param('id') id: string, @Req() req) {
		const userId = req.user.id;
		return this.orderService.cancleOrder(userId, +id);
	}
}
