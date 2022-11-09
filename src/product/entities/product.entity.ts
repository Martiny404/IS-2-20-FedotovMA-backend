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
}

// import { ViewColumn, ViewEntity } from "typeorm";

// @ViewEntity({
//     expression: `
//         select
//         p.name
//         ,p.id
//         ,max(CASE WHEN o.id = 1 THEN ov.value ELSE 0 END) AS 'hdd'
//         ,max(CASE WHEN o.id = 2 THEN ov.value ELSE 0 END) AS 'ram'
//         from product as p
//         left join product_values as pv on pv.product_id = p.id
//         left join option_value as ov on ov.id = pv.value_id
//         left join \`option\` as o on o.id = ov.option_id
//         group by p.name
//     `
// })
// export class ProductPivotView {
//     @ViewColumn()
//     id: number;
//     @ViewColumn()
//     name: string;
//     @ViewColumn()
//     hdd: string;
//     @ViewColumn()
//     ram: string;
// }

// const p = await this.productViewRepo.find({
// 	where: [
// 		{
// 			hdd: '512gb',
// 			ram: '8gb',
// 		},
// 		{
// 			hdd: '256gb'
// 		}
// 	]
// });