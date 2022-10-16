import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly userRepo: Repository<User>
	) {}

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
