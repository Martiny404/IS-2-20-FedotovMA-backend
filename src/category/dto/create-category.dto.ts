import { IsString, Length } from 'class-validator';

export class CreateCategoryDto {
	@IsString()
	@Length(2, 20, {
		message: 'Название категории должно быть от 2 до 20 символов',
	})
	name: string;
}
