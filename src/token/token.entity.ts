import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	JoinColumn,
	OneToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Base } from '../utils/base';

@Entity()
export class Token extends Base {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar' })
	refreshToken: string;

	@OneToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;
}
