import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CheckAuth } from 'src/decorators/auth.decorator';
import { CreateOffer } from './dto/create-offer.dto';
import { SpecialOfferService } from './special-offer.service';

@Controller('special-offer')
export class SpecialOfferController {
	constructor(private readonly specialOfferService: SpecialOfferService) {}

	@CheckAuth('admin', true)
	@Post('/')
	async create(@Body() dto: CreateOffer) {
		return this.specialOfferService.create(dto);
	}

	@Get('/:id')
	async byId(@Param('id') id: string) {
		return this.specialOfferService.byId(+id);
	}

	@Get('/by-category:/id')
	async getOffersByCategory(@Param('id') id: string) {
		return this.specialOfferService.getOffersByCategory(+id);
	}

	@Delete('/remove/:id')
	async remove(@Param('id') id: string) {
		return this.specialOfferService.remove(+id);
	}
}
