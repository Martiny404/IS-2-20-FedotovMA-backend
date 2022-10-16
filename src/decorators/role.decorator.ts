import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin-guard';
import { JwtTokenGuard } from 'src/guards/jwt-token.guard';

export function CheckRole(role: 'admin' | 'user') {
	return applyDecorators(
		role === 'admin'
			? UseGuards(JwtTokenGuard, AdminGuard)
			: UseGuards(JwtTokenGuard)
	);
}
