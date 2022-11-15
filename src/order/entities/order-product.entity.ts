import { Product } from 'src/product/entities/product.entity';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderProduct {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Order, order => order.orderProducts, {
		cascade: true,
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({ name: 'order_id' })
	order: Order;

	@ManyToOne(() => Product, product => product.productOrders, {
		cascade: true,
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({ name: 'product_id' })
	product: Product;

	@Column({ type: 'int' })
	quantity: number;

	@Column({ type: 'float' })
	price: number;
}
