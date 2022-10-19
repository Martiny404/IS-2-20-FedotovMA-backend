import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/brand/brand.entity';
import { Option } from 'src/option/option.entity';
import { Product } from 'src/product/product.entity';
import { CategoryController } from './category.controller';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@Module({
	controllers: [CategoryController],
	providers: [CategoryService],
	imports: [TypeOrmModule.forFeature([Product, Category, Option, Brand])],
	exports: [CategoryService],
})
export class CategoryModule {}
