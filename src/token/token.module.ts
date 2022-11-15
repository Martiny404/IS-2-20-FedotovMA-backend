import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtConfig } from 'src/config/jwt.config';
import { User } from 'src/user/entities/user.entity';
import { Token } from './token.entity';
import { TokenService } from './token.service';

@Module({
	providers: [TokenService],
	imports: [
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: JwtConfig,
		}),
		TypeOrmModule.forFeature([Token, User]),
	],
	exports: [JwtModule, TokenService],
})
export class TokenModule {}
