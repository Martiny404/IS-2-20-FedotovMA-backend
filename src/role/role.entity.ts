import { User } from 'src/user/user.entity';
import { Entity, Column, ManyToMany, OneToMany } from 'typeorm';
import { Base } from '../utils/base';

@Entity()
export class Role extends Base {
	@Column({ unique: true, type: 'varchar', name: 'role_name' })
	roleName: string;

	@OneToMany(() => User, user => user.role)
	users: User[];
}
