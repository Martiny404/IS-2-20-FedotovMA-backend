import { ConfigService } from '@nestjs/config';

export const MailConfig = async (configService: ConfigService) => ({
	transport: {
		host: configService.get('MAIL_HOST'),
		port: configService.get('MAIL_PORT'),
		secure: false,
		auth: {
			user: configService.get('MAIL_USER'),
			pass: configService.get('MAIL_PASS'),
		},
	},
});
