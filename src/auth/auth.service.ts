import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { MailService } from 'src/mail/mail.service';
import { RoleService } from 'src/role/role.service';
import { TokenService } from 'src/token/token.service';
import { AuthUser } from 'src/types/user-auth.inteface';
import { User } from 'src/user/user.entity';
import { makeUserData } from 'src/utils/makeUserData';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User) private readonly userRepo: Repository<User>,
		private readonly tokenService: TokenService,
		private readonly mailService: MailService,
		private readonly roleService: RoleService
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
		try {
			if (!token) {
				throw new UnauthorizedException('Не авторизован!');
			}
			const userData = this.tokenService.validateRefreshToken(token);
			const tokenFromDb = await this.tokenService.findToken(token);
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

			const tokens = await this.tokenService.generateTokens(freshUserData);

			await this.tokenService.saveRefreshToken(
				freshUserData.id,
				tokens.refreshToken
			);

			return {
				...tokens,
				user: freshUserData,
			};
		} catch (e) {
			throw e;
		}
	}
}
