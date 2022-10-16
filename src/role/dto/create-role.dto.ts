import { IsString, Length } from 'class-validator';

export class CreateRoleDto {
	@IsString()
	@Length(3, 20)
	readonly value: string;
}
