import { IsOptional, IsString, Length } from 'class-validator';

export class UpdatePostDto {
	@IsOptional()
	@IsString()
	@Length(5, 55)
	theme: string;

	@IsOptional()
	@IsString()
	text: string;

	@IsOptional()
	@IsString()
	poster: string;
}
