import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Base } from '../utils/base';

@Entity()
@Unique('user_product_unique', ['products', 'users'])
export class Rating extends Base {
	@Column({ type: 'int' })
	rate: number;

	@ManyToOne(() => Product, product => product.rating)
	@JoinColumn({ name: 'product_id' })
	products: Product[];

	@ManyToOne(() => User, user => user.rate)
	@JoinColumn({ name: 'user_id' })
	users: User[];
}
