import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/brand/brand.entity';
import { Option } from 'src/option/entities/option.entity';
import { OptionModule } from 'src/option/option.module';
import { Product } from 'src/product/entities/product.entity';
import { CategoryController } from './category.controller';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@Module({
	controllers: [CategoryController],
	providers: [CategoryService],
	imports: [
		TypeOrmModule.forFeature([Product, Category, Option, Brand]),
		OptionModule,
	],
	exports: [CategoryService],
})
export class CategoryModule {}
