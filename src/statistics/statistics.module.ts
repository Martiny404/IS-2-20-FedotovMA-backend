import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProduct } from 'src/order/entities/order-product.entity';
import { Order } from 'src/order/entities/order.entity';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
	controllers: [StatisticsController],
	providers: [StatisticsService],
	imports: [TypeOrmModule.forFeature([Order, OrderProduct])],
})
export class StatisticsModule {}
