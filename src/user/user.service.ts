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
import { CheckAuth } from 'src/decorators/auth.decorator';
import { Product } from 'src/product/entities/product.entity';
import { OrderProduct } from 'src/order/entities/order-product.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly userRepo: Repository<User>,
		@InjectRepository(Wishlist) private readonly wishRepo: Repository<Wishlist>,
		@InjectRepository(Basket) private readonly basketRepo: Repository<Basket>
	) {}

	@CheckAuth('user')
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
