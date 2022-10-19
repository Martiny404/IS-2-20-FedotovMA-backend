import { Category } from 'src/category/category.entity';
import { Product } from 'src/product/product.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Base } from '../utils/base';

@Entity()
export class Brand extends Base {
	@Column({ type: 'varchar', unique: true })
	name: string;

	@Column({ type: 'varchar', nullable: true })
	description: string;

	@OneToMany(() => Product, product => product.brand)
	products: Product[];

	@ManyToMany(() => Category, category => category.brands, {
		onDelete: 'CASCADE',
	})
	categories: Category[];
}
