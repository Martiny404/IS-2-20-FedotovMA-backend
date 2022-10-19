import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionController } from './option.controller';
import { Option } from './option.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/category/category.entity';
import { CategoryModule } from 'src/category/category.module';
import { OptionValue } from './option-value.entity';

@Module({
	providers: [OptionService],
	controllers: [OptionController],
	imports: [
		TypeOrmModule.forFeature([Option, Category, OptionValue]),
		CategoryModule,
	],
})
export class OptionModule {}
