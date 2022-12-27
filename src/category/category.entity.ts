import { Brand } from 'src/brand/brand.entity';
import { Option } from 'src/option/entities/option.entity';
import { Product } from 'src/product/entities/product.entity';
import { SpecialOffer } from 'src/special-offer/special-offer.entity';
import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', unique: true })
	name: string;

	@Column({ type: 'varchar', nullable: true })
	description: string;

	@Column({ type: 'varchar', nullable: true, name: 'category_img_path' })
	categoryImgPath: string;

	@OneToMany(() => Product, product => product.category)
	products: Product[];

	@ManyToMany(() => Option, option => option.categories, {
		onDelete: 'CASCADE',
	})
	@JoinTable()
	options: Option[];

	@OneToMany(() => SpecialOffer, specialOffer => specialOffer.category)
	offers: SpecialOffer[];

	@ManyToMany(() => Brand, brand => brand.categories, {
		onDelete: 'CASCADE',
	})
	brands: Brand[];
}
