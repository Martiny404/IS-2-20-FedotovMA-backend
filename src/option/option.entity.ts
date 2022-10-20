import { Category } from 'src/category/category.entity';
import {
	Column,
	Entity,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

import { OptionValue } from './option-value.entity';

@Entity()
export class Option {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', unique: true, name: 'option_name' })
	optionName: string;

	@ManyToMany(() => Category, category => category.options, {
		onDelete: 'CASCADE',
	})
	categories: Category[];

	@OneToMany(() => OptionValue, optionValue => optionValue.option)
	values: OptionValue[];
}
