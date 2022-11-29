import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/category/category.entity';
import { CategoryModule } from 'src/category/category.module';
import { BrandController } from './brand.controller';
import { Brand } from './brand.entity';
import { BrandService } from './brand.service';

@Module({
	controllers: [BrandController],
	providers: [BrandService],
	imports: [TypeOrmModule.forFeature([Brand, Category]), CategoryModule],
	exports: [BrandService],
})
export class BrandModule {}
