import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionController } from './option.controller';
import { Option } from './entities/option.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/category/category.entity';
import { OptionValue } from './entities/option-value.entity';
import { Product } from 'src/product/entities/product.entity';

@Module({
	providers: [OptionService],
	controllers: [OptionController],
	exports: [OptionService],
	imports: [TypeOrmModule.forFeature([Option, Category, OptionValue, Product])],
})
export class OptionModule {}
