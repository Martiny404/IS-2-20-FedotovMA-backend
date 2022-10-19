import { Category } from 'src/category/category.entity';
import { Column, Entity, JoinColumn, ManyToMany, OneToMany } from 'typeorm';
import { Base } from '../utils/base';
import { OptionValue } from './option-value.entity';

@Entity()
export class Option extends Base {
	@Column({ type: 'varchar', unique: true, name: 'option_name' })
	optionName: string;

	@ManyToMany(() => Category, category => category.options, {
		onDelete: 'CASCADE',
	})
	categories: Category[];

	@OneToMany(() => OptionValue, optionValue => optionValue.option)
	values: OptionValue[];
}
