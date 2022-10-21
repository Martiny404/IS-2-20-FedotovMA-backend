import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
	constructor(
		@InjectRepository(Role) private readonly roleRepo: Repository<Role>
	) {}
	async createRole(dto: CreateRoleDto) {
		const lowerRole = dto.value.toLowerCase();
		const isRoleExist = await this.getRoleByValue(lowerRole);

		if (isRoleExist) {
			throw new BadRequestException('Роль уже существует!');
		}

		const role = this.roleRepo.create({
			roleName: lowerRole,
		});
		await this.roleRepo.save(role);
		return role;
	}
	async getRoleByValue(value: string) {
		const role = await this.roleRepo.findOne({
			where: { roleName: value },
		});
		return role;
	}
}
