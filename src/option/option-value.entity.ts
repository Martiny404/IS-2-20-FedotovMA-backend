import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Option } from './option.entity';
import { ProductValues } from './product-values.entity';

@Entity({ name: 'option_value' })
export class OptionValue {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar' })
	value: string;

	@ManyToOne(() => Option, option => option.values, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'option_id' })
	option: Option;

	@OneToMany(() => ProductValues, productValues => productValues.productValue)
	productValues: ProductValues[];
}
