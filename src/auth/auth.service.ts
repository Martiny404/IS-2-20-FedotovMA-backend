import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { MailService } from 'src/mail/mail.service';
import { RoleService } from 'src/role/role.service';
import { TokenService } from 'src/token/token.service';

import { User } from 'src/user/entities/user.entity';
import { makeUserData } from 'src/utils/makeUserData';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User) private readonly userRepo: Repository<User>,
		private readonly configService: ConfigService,
		private readonly mailService: MailService,
		private readonly roleService: RoleService,
		private readonly tokenService: TokenService
	) {}

	async registration(email: string, password: string) {
		const potentialUser = await this.userRepo.findOne({
			where: { email },
		});
		if (potentialUser) {
			throw new BadRequestException('Пользователь уже существует!');
		}
		const passwordHash = await hash(password, 5);
		const activationLink = v4();
		const userRole = await this.roleService.getRoleByValue('user');

		if (!userRole) {
			throw new InternalServerErrorException('Ошибка сервера');
		}

		const user = this.userRepo.create({
			email,
			password: passwordHash,
			activation_link: activationLink,
			role: { id: userRole.id },
		});
		await this.userRepo.save(user);

		await this.mailService.sendActivationMail(
			email,
			`${this.configService.get('API_URL')}/api/auth/activate/${activationLink}`
		);
		const userData = makeUserData(user);
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
	}

	async login(email: string, password: string) {
		const user = await this.userRepo.findOne({
			where: { email },
			relations: {
				role: true,
			},
		});

		if (!user) {
			throw new NotFoundException('Пользователь не найден');
		}
		const isPasswodCorrect = await compare(password, user.password);

		if (!isPasswodCorrect) {
			throw new BadRequestException('Неверный логин или пароль');
		}
		const userData = makeUserData(user);
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
	}

	async activate(activationLink: string) {
		const user = await this.userRepo.findOne({
			where: { activation_link: activationLink },
		});
		if (!user) {
			throw new NotFoundException('Пользователь не найден');
		}
		user.isActivated = true;
		await this.userRepo.save(user);
	}

	async logout(refreshToken: string) {
		await this.tokenService.removeToken(refreshToken);
		return {
			message: 'Вы успешно вышли из системы!',
		};
	}

	async refresh(token: string) {
		return this.tokenService.refresh(token);
	}
}
