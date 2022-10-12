import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { TokenService } from 'src/token/token.service';
import { hash } from 'bcryptjs';
import { v4 } from 'uuid';
@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly userRepo: Repository<User>,
		private readonly tokenService: TokenService
	) {}
	async registration(email: string, password: string) {
		const potentialUser = await this.userRepo.findOne({
			where: { email },
		});
		if (potentialUser) {
			throw new Error('Пользователь уже существует!');
		}
		const passwordHash = await hash(password, 5);
		const activationLink = v4();
		const user = this.userRepo.create({ email, password: passwordHash });
		await this.userRepo.save(user);
		// await mailService.sendActivationMail(
		// 	email,
		// 	`${process.env.API_URL}/api/user/activate-user/${activationLink}`
		// );
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
	}
}
