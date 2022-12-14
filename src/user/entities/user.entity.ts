import { Order } from 'src/order/entities/order.entity';
import { Rating } from 'src/product/entities/rating.entity';
import { Role } from 'src/role/role.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Base } from '../../utils/base';
import { Basket } from './basket.entity';
import { Wishlist } from './wishlist.entity';

@Entity()
export class User extends Base {
	@Column({ unique: true, type: 'varchar' })
	email: string;

	@Column({ type: 'varchar' })
	password: string;

	@Column({ type: 'varchar', nullable: true })
	avatar: string;

	@Column({ type: 'boolean', name: 'is_activated', default: false })
	isActivated: boolean;
	@Column({ type: 'varchar', name: 'activation_link', nullable: true })
	activation_link: string;

	@Column({
		type: 'varchar',
		length: 6,
		name: 'update_info_code',
		nullable: true,
		default: null,
	})
	updateInfoCode: string;

	@ManyToOne(() => Role, role => role.users)
	@JoinColumn({ name: 'role_id' })
	role: Role;

	@OneToMany(() => Rating, rating => rating.user)
	rate: Rating[];

	@OneToMany(() => Order, order => order.user)
	orders: Order[];

	@OneToMany(() => Wishlist, wish => wish.user)
	wishes: Wishlist[];

	@OneToMany(() => Basket, basket => basket.user)
	basket: Basket[];
}
