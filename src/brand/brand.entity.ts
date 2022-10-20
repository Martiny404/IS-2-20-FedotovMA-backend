import { Category } from 'src/category/category.entity';
import { Product } from 'src/product/product.entity';
import {
	Column,
	Entity,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Brand {
	@PrimaryGeneratedColumn()
	id: number;
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
