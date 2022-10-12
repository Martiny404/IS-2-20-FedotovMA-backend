import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
	providers: [MailService],
	exports: [MailService, MailModule],
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.${process.env.NODE_ENV}.env`,
		}),
		MailerModule.forRoot({
			transport: {
				host: process.env.MAIL_HOST,
				port: process.env.MAIL_PORT,
				secure: false,
				auth: {
					user: process.env.MAIL_USER,
					pass: process.env.MAIL_PASS,
				},
			},
		}),
	],
})
export class MailModule {}
