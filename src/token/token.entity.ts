import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	JoinColumn,
	OneToOne,
} from 'typeorm';
import { User } from '../user/entities/user.entity';

@Entity()
export class Token {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar' })
	refreshToken: string;

	@OneToOne(() => User, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'user_id' })
	user: User;
}
