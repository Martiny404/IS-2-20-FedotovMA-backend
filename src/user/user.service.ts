import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { TokenService } from 'src/token/token.service';
import { compare, hash } from 'bcryptjs';
import { v4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { AuthUser } from 'src/types/user-auth.inteface';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly userRepo: Repository<User>,
		private readonly tokenService: TokenService,
		private readonly mailService: MailService,
		private readonly configService: ConfigService
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
			const user = this.userRepo.create({
				email,
				password: passwordHash,
				activation_link: activationLink,
			});
			await this.userRepo.save(user);
			await this.mailService.sendActivationMail(
				email,
				`${this.configService.get(
					'API_URL'
				)}/api/user/activate/${activationLink}`
			);
			const userData: AuthUser = {
				email: user.email,
				id: user.id,
				isActivated: user.isActivated,
			};
			const tokens = await this.tokenService.generateTokens(userData);
			if (tokens)
				await this.tokenService.saveRefreshToken(
					userData.id,
					tokens.refreshToken
				);
			return {
				...tokens,
				user: userData,
			};
		} catch (e) {
			throw new InternalServerErrorException(
				'Непредвиденная ошибка при регистрации'
			);
		}
	}
	async login(email: string, password: string) {
		try {
			const user = await this.userRepo.findOne({ where: { email } });

			if (!user) {
				throw new BadRequestException('Пользователь не найден');
			}
			const isPasswodCorrect = await compare(password, user.password);

			if (!isPasswodCorrect) {
				throw new BadRequestException('Неверный логин или пароль');
			}
			const userData: AuthUser = {
				email: user.email,
				id: user.id,
				isActivated: user.isActivated,
			};
			const tokens = await this.tokenService.generateTokens(userData);

			if (tokens)
				await this.tokenService.saveRefreshToken(
					userData.id,
					tokens.refreshToken
				);
			return {
				...tokens,
				user: userData,
			};
		} catch (e) {
			throw new InternalServerErrorException(
				'Непредвиденная ошибка при входе в систему'
			);
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
			throw new InternalServerErrorException(
				'Непредвиденная ошибка при активации'
			);
		}
	}

	async logout(refreshToken: string) {
		try {
			await this.tokenService.removeToken(refreshToken);
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
		if (!token) {
			throw new UnauthorizedException('Не авторизован!');
		}
		const userData = this.tokenService.validateAccessToken(token);
		const tokenFromDb = await this.tokenService.findToken(token);
		if (!userData || !tokenFromDb) {
			throw new UnauthorizedException('Не авторизован!');
		}

		const user = await this.userRepo.findOne({ where: { id: userData.id } });

		const freshUserData: AuthUser = {
			email: user.email,
			id: user.id,
			isActivated: user.isActivated,
		};

		const tokens = await this.tokenService.generateTokens(freshUserData);

		await this.tokenService.saveRefreshToken(
			freshUserData.id,
			tokens.refreshToken
		);

		return {
			...tokens,
			user: freshUserData,
		};
	}

	async getAll() {
		try {
			const users = await this.userRepo.find();
			return users;
		} catch (e) {
			throw new InternalServerErrorException(
				'Ошибка при получении спика пользователей'
			);
		}
	}
}
