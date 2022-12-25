import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
	constructor(
		@InjectRepository(Brand) private readonly brandRepo: Repository<Brand>,
		private readonly categoryService: CategoryService
	) {}

	async getAll() {
		return this.brandRepo.find();
	}

	async create({ name, brandImgPath }: CreateBrandDto) {
		const isBrandExist = await this.brandRepo.findOne({ where: { name } });

		if (isBrandExist) {
			throw new BadRequestException(
				'Производитель с таким именем уже существует!'
			);
		}

		const brand = this.brandRepo.create({
			name,
			brandImgPath,
		});
		return await this.brandRepo.save(brand);
	}

	async update(brandId: number, dto: UpdateBrandDto) {
		const brand = await this.brandRepo.findOne({
			where: { id: brandId },
		});

		if (!brand) {
			throw new NotFoundException('Бренда не существует!');
		}

		return this.brandRepo.save({
			...brand,
			...dto,
		});
	}

	async remove(id: number) {
		const brand = await this.brandRepo.findOne({
			where: { id },
		});
		if (!brand) {
			throw new NotFoundException('Бренда не существует!');
		}

		await this.brandRepo.remove(brand);
		return true;
	}

	async addCategory(id: number, categoryId: number) {
		const brand = await this.brandRepo.findOne({
			where: { id },
			relations: { categories: true },
		});

		if (!brand) throw new NotFoundException('Такого бренда нету!');

		const category = await this.categoryService.byId(categoryId);

		if (brand.categories.some(cat => cat.id === categoryId))
			throw new BadRequestException('У бренда уже есть такая категория!');

		brand.categories = [...brand.categories, category];

		return await this.brandRepo.save(brand);
	}

	async getBrandInfo(id: number) {
		const brand = await this.brandRepo.findOne({
			where: { id },
			relations: { products: true, categories: true, offers: true },
		});
		if (!brand) {
			throw new NotFoundException('Бренда не существует!');
		}
		return brand;
	}

	async byId(id: number) {
		const brand = await this.brandRepo.findOne({
			where: { id },
		});
		if (!brand) {
			throw new NotFoundException('Бренда не существует!');
		}
		return brand;
	}
}
