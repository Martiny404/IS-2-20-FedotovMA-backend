import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';

@Injectable()
export class BrandService {
	constructor(
		@InjectRepository(Brand) private readonly brandRepo: Repository<Brand>
	) {}
	async create({ name }: CreateBrandDto) {
		try {
			const isBrandExist = await this.brandRepo.findOne({ where: { name } });

			if (isBrandExist) {
				throw new BadRequestException(
					'Производитель с таким именем уже существует!'
				);
			}

			const brand = this.brandRepo.create({
				name,
			});
			return await this.brandRepo.save(brand);
		} catch (e) {
			throw e;
		}
	}
}
