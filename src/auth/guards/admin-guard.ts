import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/user/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
	constructor() {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest<{ user: User }>();
		const user = request.user;

		if (user.role.roleName !== 'admin') {
			throw new ForbiddenException('У вас нету прав!');
		}
		return true;
	}
}
