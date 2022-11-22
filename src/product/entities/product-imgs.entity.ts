import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_images' })
export class ProductImages {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', nullable: true, name: 'photo' })
	photo: string;

	@ManyToOne(() => Product, product => product.images)
	@JoinColumn({ name: 'product_id' })
	product: Product;
}
