import { Base } from 'src/utils/base';
import { Column, Entity } from 'typeorm';

@Entity()
export class Posts extends Base {
	@Column({ type: 'varchar' })
	theme: string;

	@Column({ type: 'varchar' })
	text: string;

	@Column({ type: 'varchar' })
	poster: string;

	@Column({ type: 'int', default: 0 })
	views: number;
}
