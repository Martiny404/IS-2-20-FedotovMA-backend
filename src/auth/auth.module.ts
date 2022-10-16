import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from 'src/token/token.module';
import { MailModule } from 'src/mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { RoleModule } from 'src/role/role.module';

@Module({
	providers: [AuthService],
	controllers: [AuthController],
	imports: [
		TypeOrmModule.forFeature([User]),
		TokenModule,
		MailModule,
		RoleModule,
	],
})
export class AuthModule {}
