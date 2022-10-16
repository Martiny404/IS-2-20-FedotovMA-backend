import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { TokenModule } from './token/token.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.${process.env.NODE_ENV}.env`,
		}),
		TypeOrmModule.forRootAsync({
			imports: [],
			inject: [],
			useFactory: TypeOrmConfig,
		}),
		UserModule,
		TokenModule,
		MailModule,
		AuthModule,
		RoleModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
