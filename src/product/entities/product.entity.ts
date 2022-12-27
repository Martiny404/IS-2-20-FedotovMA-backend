import { Brand } from 'src/brand/brand.entity';
import { Category } from 'src/category/category.entity';
import { Wishlist } from 'src/user/entities/wishlist.entity';
import { Rating } from './rating.entity';
import { ProductImages } from './product-imgs.entity';
import { Base } from '../../utils/base';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
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

	@Column({ type: 'int', name: 'in_stock' })
	inStock: number;

	@Column({ type: 'int', default: 0 })
	views: number;

	@Column({ type: 'varchar', nullable: true })
	description: string;

	@Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ON_SALE })
	status: ProductStatus;

	@Column({ type: 'boolean', default: false })
	hidden: boolean;

	@Column({ type: 'float' })
	price: number;

	@Column({ type: 'int' })
	discount_percentage: number;

	@Column({ type: 'varchar' })
	poster: string;

	@OneToMany(() => ProductImages, productImages => productImages.product)
	images: ProductImages[];

	@ManyToOne(() => Category, category => category.products, {
		cascade: true,
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({ name: 'category_id' })
	category: Category;

	@ManyToOne(() => Brand, brand => brand.products, {
		cascade: true,
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({ name: 'brand_id' })
	brand: Brand;

	@OneToMany(() => Rating, rating => rating.product)
	rating: Rating[];

	@OneToMany(() => Wishlist, wish => wish.product)
	wishes: Wishlist[];

	@OneToMany(() => Basket, basket => basket.product)
	baskets: Basket[];

	@OneToMany(() => OrderProduct, op => op.product, {})
	productOrders: OrderProduct[];

	@Column({ type: 'jsonb', default: {} })
	options: JSON;
}
