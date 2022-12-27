import { Category } from 'src/category/category.entity';
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
export class Brand {
	@PrimaryGeneratedColumn()
	id: number;
	@Column({ type: 'varchar', unique: true })
	name: string;

	@Column({ type: 'varchar', nullable: true })
	description: string;

	@Column({ type: 'varchar', nullable: true, name: 'brand_img_path' })
	brandImgPath: string;

	@OneToMany(() => Product, product => product.brand)
	products: Product[];

	@OneToMany(() => SpecialOffer, specialOffer => specialOffer.brand)
	offers: SpecialOffer[];

	@ManyToMany(() => Category, category => category.brands, {
		onDelete: 'CASCADE',
	})
	@JoinTable()
	categories: Category[];
}
