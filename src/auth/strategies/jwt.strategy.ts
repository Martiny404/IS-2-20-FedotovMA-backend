import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUser } from 'src/types/user-auth.inteface';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectRepository(User) private userRepo: Repository<User>,
		private readonly configService: ConfigService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET'),
		});
	}

	async validate({ id }: Pick<AuthUser, 'id'>) {
		const user = await this.userRepo.findOne({
			where: { id },
			relations: {
				role: true,
			},
		});
		return user;
	}
}
