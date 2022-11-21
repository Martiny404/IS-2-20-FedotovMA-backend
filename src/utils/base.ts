import {
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

export abstract class Base {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: string;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: string;
}
