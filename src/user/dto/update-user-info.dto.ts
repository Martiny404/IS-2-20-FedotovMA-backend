import { IsString, IsEmail, Length, IsOptional } from 'class-validator';

export class updateUserInfoDto {
	@IsOptional()
	@IsString({ message: 'Электронная почта имеет строковый тип!' })
	@IsEmail({}, { message: 'Введите корректный адрес электронной почты!' })
	readonly email: string;
	@IsOptional()
	@IsString({ message: 'Пароль имеет строковый тип!' })
	@Length(4, 16, {
		message: 'Длина пароля должна быть в диапазоне от 4 до 16 символов!',
	})
	readonly password: string;

	@IsString()
	@Length(6, 6)
	readonly code: string;
}
