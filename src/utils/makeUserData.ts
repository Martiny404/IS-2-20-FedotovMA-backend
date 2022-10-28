import { AuthUser } from 'src/types/user-auth.inteface';
import { User } from 'src/user/user.entity';

export function makeUserData(user: User): AuthUser {
	return {
		email: user.email,
		id: user.id,
		isActivated: user.isActivated,
		role: user.role.roleName,
	};
}
