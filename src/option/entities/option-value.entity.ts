import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	Unique,
} from 'typeorm';
import { Option } from './option.entity';

@Entity({ name: 'option_value' })
@Unique('option_value_unique', ['option', 'value'])
export class OptionValue {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar' })
	value: string;

	@ManyToOne(() => Option, option => option.values, {
		cascade: true,
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'option_id' })
	option: Option;
}
