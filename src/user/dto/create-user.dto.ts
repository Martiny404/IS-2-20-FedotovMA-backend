import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
	@IsString({ message: 'Электронная почта имеет строковый тип!' })
	@IsEmail({}, { message: 'Введите корректный адрес электронной почты!' })
	readonly email: string;
	@IsString({ message: 'Пароль имеет строковый тип!' })
	@Length(4, 16, {
		message: 'Длина пароля должна быть в диапазоне от 4 до 16 символов!',
	})
	readonly password: string;
}
