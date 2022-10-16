import { Body, Controller, Post } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Post('create')
	async createRole(@Body() dto: CreateRoleDto) {
		return this.roleService.createRole(dto);
	}
}
