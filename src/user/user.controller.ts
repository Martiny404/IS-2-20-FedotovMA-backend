import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CheckRole } from 'src/decorators/role.decorator';
import { JwtTokenGuard } from 'src/guards/jwt-token.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@CheckRole('admin')
	@Get('/')
	async getAll(@Req() req) {
		console.log(req.user);
		return this.userService.getAll();
	}
}
