import { Entity, Column } from 'typeorm';
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
}
