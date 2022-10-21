import { Brand } from 'src/brand/brand.entity';
import { Category } from 'src/category/category.entity';
import { ProductValues } from 'src/option/product-values.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Base } from '../utils/base';
import { ProductImages } from './product-imgs.entity';
import { Rating } from './rating.entity';

export enum ProductStatus {
	PREPARING_FOR_SALE = 'preparing for sale',
	ON_SALE = 'on sale',
	NOT_AVAILABLE_FOR_FALSE = 'not available for sale',
}

@Entity()
export class Product extends Base {
	@Column({ type: 'varchar', unique: true })
	name: string;

	@Column({ type: 'int', name: 'in_stock', default: 10 })
	inStock: number;

	@Column({ type: 'int', default: 0 })
	views: number;

	@Column({ type: 'varchar', nullable: true, name: 'short_info' })
	shortInfo: string;

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

	@OneToMany(() => Rating, rating => rating.products)
	rating: Rating[];

	@OneToMany(() => ProductValues, productValues => productValues.product)
	productValues: ProductValues[];
}
