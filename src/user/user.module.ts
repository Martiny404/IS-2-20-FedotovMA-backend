import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { Role } from 'src/role/role.entity';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
	controllers: [UserController],
	providers: [UserService],
	imports: [TypeOrmModule.forFeature([User, Role]), MailModule],
})
export class UserModule {}
