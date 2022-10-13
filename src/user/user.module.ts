import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { TokenModule } from 'src/token/token.module';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
	controllers: [UserController],
	providers: [UserService],
	imports: [
		TypeOrmModule.forFeature([User]),
		ConfigModule,
		TokenModule,
		MailModule,
	],
})
export class UserModule {}
