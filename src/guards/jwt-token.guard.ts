import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class JwtTokenGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly tokenService: TokenService
	) {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();

		try {
			const authHeader = request.headers.authorization;
			const [bearer, token] = authHeader.split(' ');
			if (bearer !== 'Bearer' || !token) {
				throw new UnauthorizedException({
					message: 'Нет авторизации',
				});
			}
			const user = this.tokenService.validateAccessToken(token);
			if (!user) {
				throw new UnauthorizedException({
					message: 'Нет авторизации',
				});
			}
			request.user = user;
			return true;
		} catch (e) {
			throw new UnauthorizedException({
				message: 'Нет авторизации',
			});
		}
	}
}
