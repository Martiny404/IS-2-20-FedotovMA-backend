import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TypeOrmConfig = async (): Promise<TypeOrmModuleOptions> => ({
	type: 'mysql',
	host: process.env.DB_HOST,
	port: +process.env.DB_PORT,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	// type: 'postgres',
	// host: 'localhost',
	// port: 5432,
	// username: 'postgres',
	// password: 'maxim',
	// database: 'test',
	autoLoadEntities: true,
	synchronize: true,
});
