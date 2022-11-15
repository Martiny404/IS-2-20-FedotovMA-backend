import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TypeOrmConfig = async (
	configService: ConfigService
): Promise<TypeOrmModuleOptions> => ({
	type: 'postgres',
	host: configService.get('DB_HOST'),
	port: configService.get<number>('DB_PORT'),
	database: configService.get('DB_NAME'),
	username: configService.get('DB_USER'),
	password: configService.get('DB_PASSWORD'),
	autoLoadEntities: true,
	synchronize: true,
});
