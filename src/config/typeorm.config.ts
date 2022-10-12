import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TypeOrmConfig = async (
	configService: ConfigService
): Promise<TypeOrmModuleOptions> => ({
	type: 'mysql',
	host: configService.get('DB_HOST'),
	port: configService.get('DB_PORT'),
	username: configService.get('DB_USER'),
	password: configService.get('DB_PASSWORD'),
	database: configService.get('DB_NAME'),
	autoLoadEntities: true,
	synchronize: true,
});
