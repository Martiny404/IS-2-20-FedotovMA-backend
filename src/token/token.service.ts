import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from 'src/types/user-auth.inteface';
import { User } from 'src/user/entities/user.entity';
import { makeUserData } from 'src/utils/makeUserData';
import { Repository } from 'typeorm';
import { Token } from './token.entity';

@Injectable()
export class TokenService {
	constructor(
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		@InjectRepository(Token) private readonly tokenRepo: Repository<Token>,
		@InjectRepository(User) private readonly userRepo: Repository<User>
	) {}

	async generateTokens(payload: AuthUser) {
		const accessToken = await this.jwtService.signAsync({ ...payload });
		const refreshToken = await this.jwtService.signAsync(
			{ ...payload },
			{
				expiresIn: '1m',
				secret: this.configService.get('JWT_SECRET_REFRESH'),
			}
		);
		return {
			accessToken,
			refreshToken,
		};
	}

	async saveRefreshToken(userId: number, refreshToken: string) {
		const tokenData = await this.tokenRepo.findOneBy({
			user: { id: userId },
		});
		if (tokenData) {
			tokenData.refreshToken = refreshToken;
			return this.tokenRepo.save(tokenData);
		}

		const data = {
			refreshToken,
			user: { id: userId },
		};

		const token = this.tokenRepo.create(data);

		await this.tokenRepo.save(token);
	}

	async verifyRefreshToken(token: string) {
		const data = await this.jwtService.verifyAsync<AuthUser>(token, {
			secret: this.configService.get('JWT_SECRET_REFRESH'),
		});
		return data;
	}

	async removeToken(token: string) {
		await this.tokenRepo.delete({ refreshToken: token });
	}

	async findToken(token: string) {
		const data = await this.tokenRepo.findOne({
			where: { refreshToken: token },
		});
		if (data) {
			return data;
		} else {
			throw new NotFoundException('Токен не найден');
		}
	}

	async refresh(token: string) {
		if (!token) {
			throw new UnauthorizedException('Не авторизован!');
		}
		const userData = await this.verifyRefreshToken(token);
		const tokenFromDb = await this.findToken(token);
		if (!userData || !tokenFromDb) {
			throw new UnauthorizedException('Не авторизован!');
		}
		const user = await this.userRepo.findOne({
			where: { id: userData.id },
			relations: {
				role: true,
			},
		});
		const freshUserData = makeUserData(user);

		const tokens = await this.generateTokens(freshUserData);

		await this.saveRefreshToken(freshUserData.id, tokens.refreshToken);

		return {
			...tokens,
			user: freshUserData,
		};
	}
}
