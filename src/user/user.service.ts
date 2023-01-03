import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Wishlist } from './entities/wishlist.entity';
import { Not, Repository } from 'typeorm';
import { Basket } from './entities/basket.entity';
import { OrderProduct } from 'src/order/entities/order-product.entity';
import { updateUserInfoDto } from './dto/update-user-info.dto';
import { generateCode } from 'src/utils/generateCode';
import { MailService } from 'src/mail/mail.service';
import { compare, hash } from 'bcryptjs';
import { CheckAuth } from 'src/decorators/auth.decorator';
import { OrderStatus } from 'src/order/entities/order.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly userRepo: Repository<User>,
		@InjectRepository(Wishlist) private readonly wishRepo: Repository<Wishlist>,
		@InjectRepository(Basket) private readonly basketRepo: Repository<Basket>,
		private readonly mailService: MailService
	) {}

	@CheckAuth('admin', true)
	async getAll() {
		const users = await this.userRepo.find({
			relations: {
				role: true,
			},
			select: {
				email: true,
				createdAt: true,
				id: true,
				isActivated: true,
				role: { roleName: true },
			},
			order: { createdAt: 'ASC' },
		});
		return users;
	}
	async byId(id: number) {
		const user = await this.userRepo.findOne({ where: { id } });
		return user;
	}

	async updateUserInfo(userId: number, dto: updateUserInfoDto) {
		if (!dto.email && !dto.password && !dto.avatar) {
			return false;
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
			if (dto.avatar) {
				user.avatar = dto.avatar;
			}
			await this.userRepo.save(user);
			return true;
		}
		return false;
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
	}

	async getUserWishlist(userId: number) {
		const wishlist = await this.wishRepo.find({
			where: {
				user: { id: userId },
			},
			relations: { product: { category: true, brand: true, rating: true } },
		});

		const wish = wishlist.map(w => {
			const rating = w.product.rating.reduce((acc, v) => (acc += v.rate), 0);
			return {
				...w,
				product: {
					...w.product,
					rating: rating ? rating / w.product.rating.length : 0,
				},
			};
		});
		return wish;
	}

	async getMe(userId: number) {
		const user = await this.userRepo.findOne({
			where: {
				id: userId,
				orders: {
					orderStatus: Not(OrderStatus.CANCELLED),
				},
			},
			relations: {
				orders: {
					orderProducts: {
						product: {
							category: true,
							brand: true,
							rating: true,
							images: true,
						},
					},
				},
				role: true,
			},
		});
		if (!user) {
			throw new NotFoundException('Пользователь не найден!');
		}

		return user;
	}

	async getUserBasket(userId: number) {
		const basket = await this.basketRepo.find({
			where: {
				user: { id: userId },
			},
			relations: { product: { category: true, brand: true, rating: true } },
		});
		const b = basket.map(w => {
			const rating = w.product.rating.reduce((acc, v) => (acc += v.rate), 0);
			return {
				...w,
				product: {
					...w.product,
					rating: rating ? rating / w.product.rating.length : 0,
				},
			};
		});
		return b;
	}

	async addToBasket(userId: number, productId: number) {
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
	}

	async removeFromBasket(userId: number, productId: number) {
		const baksetItem = await this.basketRepo.findOne({
			where: { user: { id: userId }, product: { id: productId } },
		});
		if (baksetItem) {
			return this.basketRepo.remove(baksetItem);
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
		if (orderProducts.length == 0) return;
		const basketItems = await Promise.all(
			orderProducts.map(async op => {
				const basketItem = await this.getBasketItem(userId, op.product.id);
				return basketItem;
			})
		);
		return this.basketRepo.remove(basketItems);
	}

	async incrementBasketItemQuantity(userId: number, productId: number) {
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
	}
	async decrementBasketItemQuantity(userId: number, productId: number) {
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
	}
}
