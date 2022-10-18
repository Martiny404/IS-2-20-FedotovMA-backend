import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/product/product.entity';
import { CategoryController } from './category.controller';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@Module({
	controllers: [CategoryController],
	providers: [CategoryService],
	imports: [TypeOrmModule.forFeature([Product, Category])],
})
export class CategoryModule {}
