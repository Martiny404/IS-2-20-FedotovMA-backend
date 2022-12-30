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
import { updateUserInfoDto } from './dto/update-user-info.dto';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@CheckAuth('user')
	@Get('/')
	async getAll() {
		return this.userService.getAll();
	}

	@CheckAuth('user')
	@Get('/me')
	async getMe(@Req() req) {
		const userId = req.user.id;
		return this.userService.getMe(userId);
	}

	@CheckAuth('user', true)
	@Get('/get-validation-code')
	async getValidationCode(@Req() req) {
		const userId = req.user.id;
		return this.userService.addValidationCodeToUser(userId);
	}

	@CheckAuth('user', true)
	@Patch('/update-user-info')
	async updateUserInfo(@Req() req, @Body() dto: updateUserInfoDto) {
		const userId = req.user.id;
		return this.userService.updateUserInfo(userId, dto);
	}

	@CheckAuth('user', true)
	@Get('/wishlist')
	async getUserWishlist(@Req() req) {
		const userId = req.user.id;
		return this.userService.getUserWishlist(userId);
	}

	@CheckAuth('user', true)
	@Get('/basket')
	async getUserBasket(@Req() req) {
		const userId = req.user.id;
		return this.userService.getUserBasket(userId);
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
		const userId = req.user.id;
		return this.userService.addToBasket(userId, productId);
	}

	@CheckAuth('user', true)
	@Patch('/basket/increment/:id')
	async incrementBasketItemQuantity(
		@Param('id') productId: string,
		@Req() req
	) {
		const userId = req.user.id;
		return this.userService.incrementBasketItemQuantity(userId, +productId);
	}

	@CheckAuth('user', true)
	@Patch('/basket/decrement/:id')
	async decrementBasketItemQuantity(
		@Param('id') productId: string,
		@Req() req
	) {
		const userId = req.user.id;
		return this.userService.decrementBasketItemQuantity(userId, +productId);
	}

	@CheckAuth('user', true)
	@Delete('/basket/:productId')
	async removeFromBasket(@Param('productId') productId: number, @Req() req) {
		const userId = req.user.id;
		return this.userService.removeFromBasket(userId, productId);
	}
}
