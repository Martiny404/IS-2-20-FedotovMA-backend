import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionController } from './option.controller';
import { Option } from './option.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/category/category.entity';
import { CategoryModule } from 'src/category/category.module';
import { OptionValue } from './option-value.entity';
import { Product } from 'src/product/product.entity';

@Module({
	providers: [OptionService],
	controllers: [OptionController],
	exports: [OptionService],
	imports: [
		TypeOrmModule.forFeature([Option, Category, OptionValue, Product]),
		CategoryModule,
	],
})
export class OptionModule {}
