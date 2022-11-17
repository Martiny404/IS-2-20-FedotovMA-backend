import { Brand } from 'src/brand/brand.entity';
import { Category } from 'src/category/category.entity';
import { OptionValue } from 'src/option/entities/option-value.entity';
import { Wishlist } from 'src/user/entities/wishlist.entity';
import { Rating } from './rating.entity';
import { ProductImages } from './product-imgs.entity';
import { Base } from '../../utils/base';
import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { Basket } from 'src/user/entities/basket.entity';
import { OrderProduct } from 'src/order/entities/order-product.entity';

export enum ProductStatus {
	PREPARING_FOR_SALE = 'PREPARING_FOR_SALE',
	ON_SALE = 'ON_SALE',
	NOT_AVAILABLE_FOR_FALSE = 'NOT_AVAILABLE_FOR_FALSE',
}

@Entity()
export class Product extends Base {
	@Column({ type: 'varchar', unique: true })
	name: string;

	@Column({ type: 'int', name: 'in_stock', default: 10 })
	inStock: number;

	@Column({ type: 'int', default: 0 })
	views: number;

	@Column({ type: 'varchar', nullable: true })
	description: string;

	@Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ON_SALE })
	status: ProductStatus;

	@Column({ type: 'boolean', default: true })
	hidden: boolean;

	@Column({ type: 'float' })
	price: number;

	@Column({ type: 'int', nullable: true })
	discount_percentage: number;

	@OneToMany(() => ProductImages, productImages => productImages.product)
	images: ProductImages[];

	@ManyToOne(() => Category, category => category.products)
	@JoinColumn({ name: 'category_id' })
	category: Category;

	@ManyToOne(() => Brand, brand => brand.products)
	@JoinColumn({ name: 'brand_id' })
	brand: Brand;

	@OneToMany(() => Rating, rating => rating.product)
	rating: Rating[];

	@OneToMany(() => Wishlist, wish => wish.product)
	wishes: Wishlist[];

	@OneToMany(() => Basket, basket => basket.product)
	baskets: Basket[];

	@OneToMany(() => OrderProduct, op => op.product)
	productOrders: OrderProduct[];

	@ManyToMany(() => OptionValue, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinTable({
		name: 'product_values',
		joinColumn: {
			name: 'product_id',
		},
		inverseJoinColumn: {
			name: 'value_id',
		},
	})
	productValues: OptionValue[];

	@Column({ type: 'jsonb', default: {} })
	options: Record<string, unknown>;
}
