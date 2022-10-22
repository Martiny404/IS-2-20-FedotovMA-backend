import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin-guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-token.guard';

export function CheckRole(role: 'admin' | 'user') {
	return applyDecorators(
		role === 'admin'
			? UseGuards(JwtAuthGuard, AdminGuard)
			: UseGuards(JwtAuthGuard)
	);
}
