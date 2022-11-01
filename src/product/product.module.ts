import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/category/category.entity';
import { Product } from './product.entity';
import { Brand } from 'src/brand/brand.entity';
import { Rating } from './rating.entity';
import { User } from 'src/user/user.entity';
import { OptionModule } from 'src/option/option.module';
import { ProductImages } from './product-imgs.entity';
import { OptionValue } from 'src/option/option-value.entity';

@Module({
	providers: [ProductService],
	controllers: [ProductController],
	imports: [
		TypeOrmModule.forFeature([
			Product,
			Category,
			Brand,
			Rating,
			ProductImages,
			User,
			OptionValue,
		]),
		OptionModule,
	],
})
export class ProductModule {}
