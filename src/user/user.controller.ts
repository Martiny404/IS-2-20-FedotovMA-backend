import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('registration')
	async registration(@Body() userDto: CreateUserDto, @Res() res: Response) {
		const user = await this.userService.registration(
			userDto.email,
			userDto.password
		);
		res.cookie('refreshToken', user.refreshToken, {
			httpOnly: true,
			maxAge: 900000,
		});
		return res.json(user);
	}
	@Get('activate/:link')
	async activate(@Param('link') activationLink: string, @Res() res: Response) {
		await this.userService.activate(activationLink);
		return res.redirect('https://ya.ru');
	}
}
