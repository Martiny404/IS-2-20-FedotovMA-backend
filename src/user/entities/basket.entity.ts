import { Product } from 'src/product/entities/product.entity';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Basket {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'int', default: 1 })
	quantity: number;

	@ManyToOne(() => Product, product => product.baskets, {
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
