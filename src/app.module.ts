import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { TokenModule } from './token/token.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';

import { BrandModule } from './brand/brand.module';

import { OptionModule } from './option/option.module';
import { FileModule } from './file/file.module';

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
		ProductModule,
		CategoryModule,
		BrandModule,
		OptionModule,
		FileModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
