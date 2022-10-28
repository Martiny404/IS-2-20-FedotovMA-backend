import { IsString, Length } from 'class-validator';

export class CreateOptionDto {
	@IsString()
	@Length(3, 55)
	name: string;
}
