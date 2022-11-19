import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
	constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	async sendActivationMail(to: string, link: string) {
		try {
			this.mailerService.sendMail({
				to,
				from: this.configService.get('MAIL_USER'),
				subject:
					'Активация аккаунта на сайте: ' +
					this.configService.get('CLIENT_URL'),
				text: '',
				html: `
        <div>
				<div style="color: #fff;text-align:center; width:300px; padding: 10px 20px; margin:0 auto; background-color: #fc8507; border-radius: 10px;">
					<h1 style="color: #fff; font-weight: bold;">Привет дорогой друг!</h1>
					<span style="color: #fff; font-weight: 500; font-size: 20px; display: block;"
						>Спасибо что зарегистрировался на нашем сайте!</span
					>
					<br />
					<a style="font-size: 16px; display: block;" href="${link}"
						>Подтверди аккаунт</a
					>
				</div>
			</div>
        `,
			});
		} catch (e) {
			throw new InternalServerErrorException(
				'Ошибка при отправке письма на почту'
			);
		}
	}

	async activeOrderMail(to: string, code: string, orderId: number) {
		try {
			this.mailerService.sendMail({
				to,
				from: this.configService.get('MAIL_USER'),
				subject:
					'Код подтверждения заказа на сайте: ' +
					this.configService.get('CLIENT_URL'),
				text: '',
				html: `
        <div>
				<div style="color: #fff;text-align:center; width:300px; padding: 10px 20px; margin:0 auto; background-color: #fc8507; border-radius: 10px;">
					<h1 style="color: #fff; font-weight: bold;">Привет дорогой друг!</h1>
					<span style="color: #fff; font-weight: 500; font-size: 20px; display: block;"
						>Спасибо за оформление заказа №${orderId}!</span
					>
					<br />
					<span style="font-size: 26px; display:block;color:#fff">${code}</span>
				</div>
			</div>
        `,
			});
		} catch (e) {
			throw e;
		}
	}

	async sendUpdatingUserInfoCode(to: string, code: string) {
		try {
			this.mailerService.sendMail({
				to,
				from: this.configService.get('MAIL_USER'),
				subject:
					'Код для обновления профиля: ' + this.configService.get('CLIENT_URL'),
				text: '',
				html: `
        <div>
				<div style="color: #fff;text-align:center; width:300px; padding: 10px 20px; margin:0 auto; background-color: #fc8507; border-radius: 10px;">
					<h1 style="color: #fff; font-weight: bold;">Привет дорогой друг!</h1>
					<span style="color: #fff; font-weight: 500; font-size: 20px; display: block;"
						>Код для обновления профиля!</span
					>
					<br />
					<span style="font-size: 26px; display:block;color:#fff">${code}</span>
				</div>
			</div>
        `,
			});
		} catch (e) {
			throw e;
		}
	}
}
