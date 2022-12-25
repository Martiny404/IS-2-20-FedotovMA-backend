import { IsString, Length } from 'class-validator';

export class CreatePostDto {
	@IsString()
	@Length(5, 55, {
		message: 'Тема статьи должна быть от 5 до 55 символов!',
	})
	theme: string;

	@IsString({
		message: 'Текст должен быть строкой!',
	})
	text: string;

	@IsString({
		message: 'Путь до картинки должен быть строкой!',
	})
	poster: string;
}
