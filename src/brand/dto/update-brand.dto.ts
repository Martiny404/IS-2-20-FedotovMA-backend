import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateBrandDto {
	@IsOptional()
	@IsString()
	@Length(2, 20, { message: 'Название бренда должно быть от 2 до 20 символов' })
	name: string;

	@IsOptional()
	@IsString()
	brandImgPath: string;

	@IsOptional()
	@IsString()
	description: string;
}
