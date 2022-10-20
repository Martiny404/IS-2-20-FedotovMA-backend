import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	JoinColumn,
	OneToOne,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Token {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar' })
	refreshToken: string;

	@OneToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;
}
