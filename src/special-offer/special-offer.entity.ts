import { Brand } from 'src/brand/brand.entity';
import { Category } from 'src/category/category.entity';
import { Base } from 'src/utils/base';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class SpecialOffer extends Base {
	@Column({ name: 'end_date', type: 'varchar' })
	endDate: string;

	@ManyToOne(() => Category, category => category.offers, {
		cascade: true,
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({ name: 'category_id' })
	category: Category;

	@ManyToOne(() => Brand, brand => brand.offers, {
		cascade: true,
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({ name: 'brand_id' })
	brand: Brand;

	@Column({ default: 0, type: 'int' })
	discount: number;

	@Column({ nullable: true, type: 'varchar' })
	description: string;

	@Column({ type: 'varchar' })
	photo: string;
}
