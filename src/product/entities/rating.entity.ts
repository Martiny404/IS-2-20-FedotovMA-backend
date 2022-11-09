import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
} from 'typeorm';

@Entity()
@Unique('user_product_unique', ['product', 'user'])
export class Rating {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'int' })
	rate: number;

	@ManyToOne(() => Product, product => product.rating, {
		cascade: true,
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({ name: 'product_id' })
	product: Product;

	@ManyToOne(() => User, user => user.rate, {
		cascade: true,
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({ name: 'user_id' })
	user: User;
}
