import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/global-filters/http-exception.filter';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';

@UseFilters(HttpExceptionFilter)
@Controller('role')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Post('create')
	async createRole(@Body() dto: CreateRoleDto) {
		return this.roleService.createRole(dto);
	}
}
