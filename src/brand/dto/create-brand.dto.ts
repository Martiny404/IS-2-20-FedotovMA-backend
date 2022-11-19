import { IsString, Length } from 'class-validator';

export class CreateBrandDto {
	@IsString()
	@Length(2, 20, { message: 'Название бренда должно быть от 2 до 20 символов' })
	name: string;

	@IsString()
	brandImgPath: string;
}
