import { Brand } from 'src/brand/brand.entity';
import { Option } from 'src/option/option.entity';
import { Product } from 'src/product/product.entity';
import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', unique: true })
	name: string;

	@Column({ type: 'varchar', nullable: true })
	description: string;

	@OneToMany(() => Product, product => product.category)
	products: Product[];

	@ManyToMany(() => Option, option => option.categories, {
		onDelete: 'CASCADE',
	})
	@JoinTable()
	options: Option[];

	@ManyToMany(() => Brand, brand => brand.categories, {
		onDelete: 'CASCADE',
	})
	@JoinTable()
	brands: Brand[];
}
