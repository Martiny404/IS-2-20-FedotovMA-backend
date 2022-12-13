import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailModule } from 'src/mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { RoleModule } from 'src/role/role.module';

import { Token } from '../token/token.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Basket } from 'src/user/entities/basket.entity';

import { TokenModule } from 'src/token/token.module';

@Module({
	providers: [AuthService, JwtStrategy],
	controllers: [AuthController],

	imports: [
		TypeOrmModule.forFeature([User, Token, Basket]),
		MailModule,
		RoleModule,
		TokenModule,
	],
	exports: [AuthService],
})
export class AuthModule {}
