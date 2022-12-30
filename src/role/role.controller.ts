import { Body, Controller, Post } from '@nestjs/common';
import { CheckAuth } from 'src/decorators/auth.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@CheckAuth('admin', true)
	@Post('create')
	async createRole(@Body() dto: CreateRoleDto) {
		return this.roleService.createRole(dto);
	}
}
