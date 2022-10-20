import { Product } from 'src/product/product.entity';
import {
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
} from 'typeorm';
import { OptionValue } from './option-value.entity';

@Entity({ name: 'product_values' })
@Unique('product_values_unique', ['productValue', 'product'])
export class ProductValues {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Product, product => product.productValues, {
		cascade: true,
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({ name: 'product_id' })
	product: Product;

	@ManyToOne(() => OptionValue, value => value.productValues)
	@JoinColumn({ name: 'value_id' })
	productValue: OptionValue;
}
