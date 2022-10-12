import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtConfig } from 'src/config/jwt.config';
import { User } from 'src/user/user.entity';
import { Token } from './token.entity';
import { TokenService } from './token.service';

@Module({
	providers: [TokenService],
	imports: [
		TokenModule,
		TypeOrmModule.forFeature([Token, User]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: JwtConfig,
		}),
	],
	exports: [JwtModule, TokenService],
})
export class TokenModule {}
