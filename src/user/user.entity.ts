import { Role } from 'src/role/role.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from '../utils/base';

@Entity()
export class User extends Base {
	@Column({ unique: true, type: 'varchar' })
	email: string;

	@Column({ type: 'varchar' })
	password: string;

	@Column({ type: 'boolean', name: 'is_activated', default: false })
	isActivated: boolean;
	@Column({ type: 'varchar', name: 'activation_link', nullable: true })
	activation_link: string;

	@ManyToOne(() => Role, role => role.users)
	@JoinColumn({ name: 'role_id' })
	role: Role;
}
