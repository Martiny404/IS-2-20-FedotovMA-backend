import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { Basket } from './entities/basket.entity';
import { OrderProduct } from 'src/order/entities/order-product.entity';
import { updateUserInfoDto } from './dto/update-user-info.dto';
import { generateCode } from 'src/utils/generateCode';
import { MailService } from 'src/mail/mail.service';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly userRepo: Repository<User>,
		@InjectRepository(Wishlist) private readonly wishRepo: Repository<Wishlist>,
		@InjectRepository(Basket) private readonly basketRepo: Repository<Basket>,
		private readonly mailService: MailService
	) {}

	async getAll() {
		try {
			const users = await this.userRepo.find();
			return users;
		} catch (e) {
			throw new InternalServerErrorException(
				'Ошибка при получении спика пользователей'
			);
		}
	}
	async byId(id: number) {
		const user = await this.userRepo.findOne({ where: { id } });
		return user;
	}

	async updateUserInfo(userId: number, dto: updateUserInfoDto) {
		try {
			if (!dto.email && !dto.password) {
				return;
			}
			const user = await this.byId(userId);

			if (!user) {
				throw new NotFoundException('Пользователь не найден!');
			}

			const isCodeValid = await this.validateUpdateInfoCode(user.id, dto.code);

			if (isCodeValid) {
				if (dto.email) {
					const isMailExist = await this.userRepo.findOne({
						where: { email: dto.email },
					});
					if (isMailExist) {
						throw new BadRequestException('Почта занята!');
					}
					user.email = dto.email;
				}
				if (dto.password) {
					const isPasswordMatch = await compare(dto.password, user.password);
					if (isPasswordMatch) {
						throw new BadRequestException('Новый пароль совпадает со старым!');
					}
					const passwordHash = await hash(dto.password, 5);
					user.password = passwordHash;
				}
				return this.userRepo.save(user);
			}
		} catch (e) {
			throw e;
		}
	}

	async addValidationCodeToUser(userId: number) {
		const user = await this.byId(userId);
		if (!user) {
			throw new NotFoundException('Пользователь не найден!');
		}
		const code = generateCode();
		user.updateInfoCode = code;
		await this.userRepo.save(user);
		await this.mailService.sendUpdatingUserInfoCode(user.email, code);
		return true;
	}

	async validateUpdateInfoCode(userId: number, validateCode: string) {
		const user = await this.userRepo.findOne({
			where: { id: userId, updateInfoCode: validateCode },
		});
		if (!user) {
			throw new BadRequestException('Неверный код!');
		}
		user.updateInfoCode = null;
		await this.userRepo.save(user);
		return true;
	}

	async toggleToWishlist(userId: number, productId: number) {
		try {
			const existedWish = await this.wishRepo.findOne({
				where: {
					user: { id: userId },
					product: { id: productId },
				},
			});
			if (existedWish) {
				return this.wishRepo.remove(existedWish);
			}
			const wish = this.wishRepo.create({
				user: { id: userId },
				product: { id: productId },
			});
			return this.wishRepo.save(wish);
		} catch (e) {
			throw e;
		}
	}

	async getUserWishlist(userId: number) {
		try {
			const wishlist = await this.wishRepo.find({
				where: {
					user: { id: userId },
				},
				relations: { product: { category: true, brand: true } },
			});
			return wishlist;
		} catch (e) {
			throw e;
		}
	}

	async addToBasket(userId: number, productId: number) {
		try {
			const productInUserBasket = await this.basketRepo.findOne({
				where: { user: { id: userId }, product: { id: productId } },
			});
			if (productInUserBasket) {
				throw new BadRequestException('Продукт уже в корзине!');
			}
			const basketItem = this.basketRepo.create({
				product: { id: productId },
				user: { id: userId },
			});
			return await this.basketRepo.save(basketItem);
		} catch (e) {
			throw e;
		}
	}

	async removeFromBasket(userId: number, productId: number) {
		try {
			const baksetItem = await this.basketRepo.findOne({
				where: { user: { id: userId }, product: { id: productId } },
			});
			if (baksetItem) {
				return this.basketRepo.remove(baksetItem);
			}
		} catch (e) {
			throw e;
		}
	}

	async getBasketItem(userId: number, productId: number) {
		const basketItem = await this.basketRepo.findOne({
			where: {
				user: { id: userId },
				product: { id: productId },
			},
		});
		if (!basketItem) {
			throw new NotFoundException('Продукт в корзине не найден!');
		}
		return basketItem;
	}

	async removeSeveralProductsFromBasket(
		userId: number,
		orderProducts: OrderProduct[]
	) {
		try {
			if (orderProducts.length == 0) return;
			const basketItems = await Promise.all(
				orderProducts.map(async op => {
					const basketItem = await this.getBasketItem(userId, op.product.id);
					return basketItem;
				})
			);
			return this.basketRepo.remove(basketItems);
		} catch (e) {
			throw e;
		}
	}

	async incrementBasketItemQuantity(userId: number, productId: number) {
		try {
			const basketItem = await this.basketRepo.findOne({
				where: { user: { id: userId }, product: { id: productId } },
				relations: {
					product: true,
				},
			});

			if (!basketItem) {
				throw new NotFoundException('В корзине продукт не найден!');
			}

			const productQuantity = basketItem.product.inStock;

			if (productQuantity < basketItem.quantity + 1) return;

			basketItem.quantity += 1;
			return await this.basketRepo.save(basketItem);
		} catch (e) {
			throw e;
		}
	}
	async decrementBasketItemQuantity(userId: number, productId: number) {
		try {
			const basketItem = await this.basketRepo.findOne({
				where: { user: { id: userId }, product: { id: productId } },
			});

			if (!basketItem) {
				throw new NotFoundException('В корзине продукт не найден!');
			}

			if (basketItem.quantity - 1 === 0) {
				return this.removeFromBasket(userId, productId);
			}

			basketItem.quantity -= 1;
			return await this.basketRepo.save(basketItem);
		} catch (e) {
			throw e;
		}
	}
}
