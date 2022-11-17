import { User } from 'src/user/entities/user.entity';
import { Base } from 'src/utils/base';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderProduct } from './order-product.entity';

export enum OrderStatus {
	COMPLETED = 'completed',
	CANCELLED = 'CANCELLED',
	ON_THE_WAY = 'ON_THE_WAY',
	WAITING_FOR_PAYMENT_OR_RECEIPT = 'WAITING FOR PAYMENT OR RECEIPT',
	IN_WAITING = 'IN_WAITING',
}

@Entity()
export class Order extends Base {
	@Column({ type: 'varchar' })
	order_date: string;

	@ManyToOne(() => User, user => user.orders)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@OneToMany(() => OrderProduct, op => op.order)
	orderProducts: OrderProduct[];

	@Column({
		type: 'enum',
		enum: OrderStatus,
		default: OrderStatus.IN_WAITING,
		name: 'order_status',
	})
	orderStatus: OrderStatus;

	@Column({ type: 'boolean', default: false })
	is_activated: boolean;

	@Column({ type: 'varchar', length: 6 })
	activation_code: string;
}
