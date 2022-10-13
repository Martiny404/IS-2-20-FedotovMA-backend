import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { TokenService } from 'src/token/token.service';
import { hash } from 'bcryptjs';
import { v4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
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
			const userData = {
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
}
