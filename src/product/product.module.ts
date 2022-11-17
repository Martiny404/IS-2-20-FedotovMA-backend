import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Rating } from './entities/rating.entity';
import { OptionModule } from 'src/option/option.module';
import { ProductImages } from './entities/product-imgs.entity';
import { OptionValue } from 'src/option/entities/option-value.entity';
import { UserModule } from 'src/user/user.module';

@Module({
	providers: [ProductService],
	controllers: [ProductController],
	imports: [
		TypeOrmModule.forFeature([Product, Rating, ProductImages, OptionValue]),
		UserModule,
		OptionModule,
	],
	exports: [ProductService],
})
export class ProductModule {}
