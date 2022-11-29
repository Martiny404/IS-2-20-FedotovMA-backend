import { Module } from '@nestjs/common';
import { SpecialOfferService } from './special-offer.service';
import { SpecialOfferController } from './special-offer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialOffer } from './special-offer.entity';
import { CategoryModule } from 'src/category/category.module';
import { BrandModule } from 'src/brand/brand.module';

@Module({
	providers: [SpecialOfferService],
	controllers: [SpecialOfferController],
	imports: [
		TypeOrmModule.forFeature([SpecialOffer]),
		CategoryModule,
		BrandModule,
	],
})
export class SpecialOfferModule {}
