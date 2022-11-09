import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { User } from 'src/user/entities/user.entity';
import { Role } from './role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	providers: [RoleService],
	controllers: [RoleController],
	imports: [TypeOrmModule.forFeature([User, Role])],
	exports: [RoleService],
})
export class RoleModule {}
