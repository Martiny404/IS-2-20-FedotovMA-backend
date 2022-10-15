import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
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
	@Post('login')
	async login(@Body() userDto: CreateUserDto, @Res() res: Response) {
		const user = await this.userService.login(userDto.email, userDto.password);
		res.cookie('refreshToken', user.refreshToken, {
			httpOnly: true,
			maxAge: 900000,
		});
		return res.status(200).json(user);
	}
	@Post('logout')
	async logout(@Res() res: Response, @Req() req: Request) {
		const refreshToken = req.cookies.refreshToken;
		const message = await this.userService.logout(refreshToken);
		res.clearCookie('refreshToken');
		return res.status(200).json(message);
	}

	@Get('activate/:link')
	async activate(@Param('link') activationLink: string, @Res() res: Response) {
		await this.userService.activate(activationLink);
		return res.redirect('https://ya.ru');
	}
}
