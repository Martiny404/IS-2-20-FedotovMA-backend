import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionModule } from 'src/option/option.module';
import { OrderProduct } from 'src/order/entities/order-product.entity';
import { Order } from 'src/order/entities/order.entity';
import { ProductImages } from 'src/product/entities/product-imgs.entity';
import { Product } from 'src/product/entities/product.entity';
import { Rating } from 'src/product/entities/rating.entity';
import { ProductModule } from 'src/product/product.module';
import { ProductService } from 'src/product/product.service';
import { UserModule } from 'src/user/user.module';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
	controllers: [StatisticsController],
	providers: [StatisticsService],
	imports: [TypeOrmModule.forFeature([Order, OrderProduct, Product])],
})
export class StatisticsModule {}
