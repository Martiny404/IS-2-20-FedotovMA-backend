import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TypeOrmConfig = async (): Promise<TypeOrmModuleOptions> => ({
	type: 'mysql',
	host: process.env.DB_HOST,
	port: +process.env.DB_PORT,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	autoLoadEntities: true,
	synchronize: true,
});
