import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandController } from './brand.controller';
import { Brand } from './brand.entity';
import { BrandService } from './brand.service';

@Module({
	controllers: [BrandController],
	providers: [BrandService],
	imports: [TypeOrmModule.forFeature([Brand])],
})
export class BrandModule {}
