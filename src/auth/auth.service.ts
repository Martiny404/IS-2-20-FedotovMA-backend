import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { MailService } from 'src/mail/mail.service';
import { RoleService } from 'src/role/role.service';
import { AuthUser } from 'src/types/user-auth.inteface';
import { User } from 'src/user/user.entity';
import { makeUserData } from 'src/utils/makeUserData';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { Token } from './token.entity';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User) private readonly userRepo: Repository<User>,
		@InjectRepository(Token) private readonly tokenRepo: Repository<Token>,
		private readonly mailService: MailService,
		private readonly roleService: RoleService,
		private readonly jwtService: JwtService
	) {}

	async registration(email: string, password: string) {
		try {
			const potentialUser = await this.userRepo.findOne({
				where: { email },
			});
			if (potentialUser) {
				throw new BadRequestException('Пользователь уже существует!');
			}
			const passwordHash = await hash(password, 5);
			const activationLink = v4();
			const userRole = await this.roleService.getRoleByValue('user');

			const user = this.userRepo.create({
				email,
				password: passwordHash,
				activation_link: activationLink,
				role: { id: userRole.id },
			});
			await this.userRepo.save(user);
			await this.mailService.sendActivationMail(
				email,
				`${process.env.API_URL}/api/auth/activate/${activationLink}`
			);
			const userData = makeUserData(user, userRole.roleName);
			const tokens = await this.generateTokens(userData);
			if (tokens) await this.saveRefreshToken(userData.id, tokens.refreshToken);
			return {
				...tokens,
				user: userData,
			};
		} catch (e) {
			throw e;
		}
	}
	async login(email: string, password: string) {
		try {
			const user = await this.userRepo.findOne({
				where: { email },
				relations: {
					role: true,
				},
			});

			if (!user) {
				throw new BadRequestException('Пользователь не найден');
			}
			const isPasswodCorrect = await compare(password, user.password);

			if (!isPasswodCorrect) {
				throw new BadRequestException('Неверный логин или пароль');
			}
			const userData = makeUserData(user, user.role.roleName);
			const tokens = await this.generateTokens(userData);

			if (tokens) await this.saveRefreshToken(userData.id, tokens.refreshToken);
			return {
				...tokens,
				user: userData,
			};
		} catch (e) {
			throw e;
		}
	}
	async activate(activationLink: string) {
		try {
			const user = await this.userRepo.findOne({
				where: { activation_link: activationLink },
			});
			if (!user) {
				throw new BadRequestException('Пользователь не найден');
			}
			user.isActivated = true;
			await this.userRepo.save(user);
		} catch (e) {
			throw e;
		}
	}

	async logout(refreshToken: string) {
		try {
			await this.removeToken(refreshToken);
			return {
				message: 'Вы успешно вышли из системы!',
			};
		} catch (e) {
			throw new InternalServerErrorException(
				'Непредвиденная ошибка при выходе из системы'
			);
		}
	}

	async refresh(token: string) {
		try {
			if (!token) {
				throw new UnauthorizedException('Не авторизован!');
			}
			const userData = await this.jwtService.verifyAsync<AuthUser>(token, {
				secret: process.env.JWT_SECRET_REFRESH,
			});
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

			const freshUserData = makeUserData(user, user.role.roleName);

			const tokens = await this.generateTokens(freshUserData);

			await this.saveRefreshToken(freshUserData.id, tokens.refreshToken);

			return {
				...tokens,
				user: freshUserData,
			};
		} catch (e) {
			throw e;
		}
	}

	async generateTokens(payload: AuthUser) {
		try {
			const accessToken = await this.jwtService.signAsync(
				{ ...payload },
				{
					expiresIn: '1m',
					secret: process.env.JWT_SECRET,
				}
			);
			const refreshToken = await this.jwtService.signAsync(
				{ ...payload },
				{
					expiresIn: '10m',
					secret: process.env.JWT_SECRET_REFRESH,
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

	async findToken(token: string) {
		const data = await this.tokenRepo.findOne({
			where: { refreshToken: token },
		});
		return data;
	}
}
