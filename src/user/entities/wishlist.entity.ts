import { Product } from 'src/product/entities/product.entity';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@Unique('user_product_unique', ['product', 'user'])
export class Wishlist {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Product, product => product.wishes, {
		cascade: true,
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({ name: 'product_id' })
	product: Product;

	@ManyToOne(() => User, user => user.wishes, {
		cascade: true,
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({ name: 'user_id' })
	user: User;
}
