import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin-guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-token.guard';
import { isActivatedGuard } from 'src/auth/guards/user-activated.guard';

export function CheckAuth(role: 'admin' | 'user', flag?: boolean) {
	if (!flag) {
		return applyDecorators(
			role === 'admin'
				? UseGuards(JwtAuthGuard, AdminGuard)
				: UseGuards(JwtAuthGuard)
		);
	}
	return applyDecorators(
		role === 'admin'
			? UseGuards(JwtAuthGuard, isActivatedGuard, AdminGuard)
			: UseGuards(JwtAuthGuard, isActivatedGuard)
	);
}
