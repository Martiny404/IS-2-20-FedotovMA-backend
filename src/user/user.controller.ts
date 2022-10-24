import { Controller, Get } from '@nestjs/common';

import { CheckRole } from 'src/decorators/role.decorator';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@CheckRole('user')
	@Get('/')
	async getAll() {
		return this.userService.getAll();
	}
}
