import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailModule } from 'src/mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { RoleModule } from 'src/role/role.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from 'src/config/jwt.config';
import { Token } from './token.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	providers: [AuthService, JwtStrategy],
	controllers: [AuthController],

	imports: [
		TypeOrmModule.forFeature([User, Token]),
		JwtModule.registerAsync({
			imports: [],
			inject: [],
			useFactory: JwtConfig,
		}),
		MailModule,
		RoleModule,
	],
	exports: [JwtModule, AuthService],
})
export class AuthModule {}
