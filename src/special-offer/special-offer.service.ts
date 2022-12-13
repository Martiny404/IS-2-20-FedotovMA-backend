import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandService } from 'src/brand/brand.service';
import { CategoryService } from 'src/category/category.service';
import { Repository } from 'typeorm';
import { CreateOffer } from './dto/create-offer.dto';
import { SpecialOffer } from './special-offer.entity';

@Injectable()
export class SpecialOfferService {
	constructor(
		private readonly brandService: BrandService,
		private readonly categoryService: CategoryService,
		@InjectRepository(SpecialOffer)
		private readonly specialOfferRepo: Repository<SpecialOffer>
	) {}

	async create(dto: CreateOffer) {
		const category = await this.categoryService.byId(dto.categoryId);
		const brand = await this.brandService.byId(dto.brandId);
		const offer = this.specialOfferRepo.create({
			...dto,
			category: { id: category.id },
			brand: { id: brand.id },
		});

		return this.specialOfferRepo.save(offer);
	}

	async getFreshOffers() {
		const offers = await this.specialOfferRepo.find({
			relations: {
				brand: true,
				category: true,
			},
			order: {
				createdAt: 'DESC',
			},
			take: 3,
		});
		return offers;
	}

	async byId(id: number) {
		const offer = await this.specialOfferRepo.findOne({
			where: { id },
			relations: {
				brand: true,
				category: true,
			},
		});

		if (!offer) throw new NotFoundException('Акция не найдена!');

		return offer;
	}

	async remove(id: number) {
		const offer = await this.byId(id);

		await this.specialOfferRepo.remove(offer);

		return true;
	}

	async getOffersByCategory(categoryId: number) {
		return this.specialOfferRepo.find({
			where: {
				category: { id: categoryId },
			},
			relations: {
				category: true,
				brand: true,
			},
		});
	}

	async getOffersByBrand(brandId: number) {
		return this.specialOfferRepo.find({
			where: {
				brand: { id: brandId },
			},
			relations: {
				category: true,
				brand: true,
			},
		});
	}

	async getAll() {
		return this.specialOfferRepo.find({
			relations: {
				brand: true,
				category: true,
			},
		});
	}
}
