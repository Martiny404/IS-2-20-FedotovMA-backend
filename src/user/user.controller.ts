import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Req,
} from '@nestjs/common';

import { CheckAuth } from 'src/decorators/auth.decorator';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@CheckAuth('user')
	@Get('/')
	async getAll() {
		return this.userService.getAll();
	}

	@CheckAuth('user', true)
	@Get('/wishlist')
	async getUserWishlist(@Req() req) {
		const userId = req.user.id;
		return this.userService.getUserWishlist(userId);
	}

	@CheckAuth('user', true)
	@Post('/wishlist')
	async toggleToWishlist(@Body('productId') productId: number, @Req() req) {
		const userId = req.user.id;
		return this.userService.toggleToWishlist(userId, productId);
	}

	@CheckAuth('user', true)
	@Post('/basket')
	async addToBasket(@Body('productId') productId: number, @Req() req) {
		console.log(req.user);
		const userId = req.user.id;
		return this.userService.addToBasket(userId, productId);
	}

	@CheckAuth('user', true)
	@Patch('/basket/increment')
	async incrementBasketItemQuantity(
		@Body('productId') productId: number,
		@Req() req
	) {
		const userId = req.user.id;
		return this.userService.incrementBasketItemQuantity(userId, productId);
	}

	@CheckAuth('user', true)
	@Patch('/basket/decrement')
	async decrementBasketItemQuantity(
		@Body('productId') productId: number,
		@Req() req
	) {
		const userId = req.user.id;
		return this.userService.decrementBasketItemQuantity(userId, productId);
	}

	@CheckAuth('user', true)
	@Delete('/basket/:productId')
	async removeFromBasket(@Param('productId') productId: number, @Req() req) {
		const userId = req.user.id;
		return this.userService.removeFromBasket(userId, productId);
	}
}
