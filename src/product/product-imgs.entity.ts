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

	@Column({ type: 'varchar', nullable: true, name: 'big_photo' })
	bigPhoto: string;

	@Column({ type: 'varchar', nullable: true, name: 'main_photo' })
	mainPhoto: string;

	@Column({ type: 'varchar', nullable: true, name: 'secondary_photo' })
	secondaryPhoto: string;

	@ManyToOne(() => Product, product => product.images)
	@JoinColumn({ name: 'product_id' })
	product: Product;
}
