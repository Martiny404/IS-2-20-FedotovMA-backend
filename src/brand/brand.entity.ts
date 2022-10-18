import { Product } from 'src/product/product.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from '../utils/base';

@Entity()
export class Brand extends Base {
	@Column({ type: 'varchar', unique: true })
	name: string;

	@Column({ type: 'varchar', nullable: true })
	description: string;

	@OneToMany(() => Product, product => product.brand)
	products: Product[];
}
