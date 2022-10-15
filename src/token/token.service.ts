import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from 'src/types/user-auth.inteface';
import { Repository } from 'typeorm';
import { Token } from './token.entity';

@Injectable()
export class TokenService {
	constructor(
		@InjectRepository(Token) private readonly tokenRepo: Repository<Token>,
		private readonly jwtService: JwtService
	) {}
	async generateTokens(payload: AuthUser) {
		try {
			const accessToken = await this.jwtService.signAsync(
				{ ...payload },
				{
					expiresIn: '15s',
				}
			);
			const refreshToken = await this.jwtService.signAsync(
				{ ...payload },
				{
					expiresIn: '30s',
				}
			);
			return {
				accessToken,
				refreshToken,
			};
		} catch (e) {
			throw new InternalServerErrorException(
				'Ошибка при генерации токена: ' + e.message
			);
		}
	}
	async saveRefreshToken(userId: number, refreshToken: string) {
		try {
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
		} catch (e) {
			throw new InternalServerErrorException(
				'Ошибка при сохранении токена: ' + e.message
			);
		}
	}
	async removeToken(token: string) {
		try {
			await this.tokenRepo.delete({ refreshToken: token });
		} catch (e) {
			throw new InternalServerErrorException(
				'Ошибка при удалении токена: ' + e.message
			);
		}
	}

	async validateToken(token: string) {
		try {
			const userData = await this.jwtService.verifyAsync<AuthUser>(token);
			return userData;
		} catch (e) {
			return null;
		}
	}

	async findToken(token: string) {
		const data = await this.tokenRepo.findOne({
			where: { refreshToken: token },
		});
		return data;
	}
}
