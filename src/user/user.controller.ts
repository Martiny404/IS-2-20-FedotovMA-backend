import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('registration')
	registration(@Body() userDto: CreateUserDto) {
		return this.userService.registration(userDto.email, userDto.password);
	}
	@Get('activate/:link')
	async activate(@Param('link') activationLink: string, @Res() res: Response) {
		await this.userService.activate(activationLink);
		return res.redirect('https://ya.ru');
	}
}
