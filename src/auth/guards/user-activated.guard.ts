import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class isActivatedGuard implements CanActivate {
	constructor() {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest<{ user: User }>();
		const user = request.user;

		if (!user.isActivated) {
			throw new ForbiddenException('Неактивирован!');
		}
		return true;
	}
}
