import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../utils/base';
import { Option } from './option.entity';

@Entity({ name: 'option_value' })
export class OptionValue extends Base {
	@Column({ type: 'varchar' })
	value: string;

	@ManyToOne(() => Option, option => option.values, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'option_id' })
	option: Option;
}
