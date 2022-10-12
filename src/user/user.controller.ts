import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/registration')
	registration(@Body() userDto: CreateUserDto) {
		return this.userService.registration(userDto.email, userDto.password);
	}
}
