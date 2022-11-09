import { User } from 'src/user/entities/user.entity';
import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true, type: 'varchar', name: 'role_name' })
	roleName: string;

	@OneToMany(() => User, user => user.role)
	users: User[];
}
