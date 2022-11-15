import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailConfig } from 'src/config/mail.config';
import { MailService } from './mail.service';

@Module({
	providers: [MailService],
	exports: [MailService, MailModule],
	imports: [
		MailerModule.forRootAsync({
			inject: [ConfigService],
			useFactory: MailConfig,
		}),
	],
})
export class MailModule {}
