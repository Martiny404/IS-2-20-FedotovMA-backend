import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProduct } from './entities/order-product.entity';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
	controllers: [OrderController],
	providers: [OrderService],
	imports: [TypeOrmModule.forFeature([Order, OrderProduct])],
})
export class OrderModule {}
