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

// type: 'mysql',
// 	host: configService.get('DB_HOST'),
// 	port: configService.get('DB_PORT'),
// 	username: configService.get('DB_USER'),
// 	password: configService.get('DB_PASSWORD'),
// 	database: configService.get('DB_NAME'),
// 	autoLoadEntities: true,
// 	synchronize: true,
