import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtTokenGuard } from 'src/guards/jwt-token.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UseGuards(JwtTokenGuard)
	@Get('/')
	async getAll() {
		return this.userService.getAll();
	}
}
