import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { Product } from 'src/product/entities/product.entity';
import { Role } from 'src/role/role.entity';
import { Basket } from './entities/basket.entity';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Wishlist } from './entities/wishlist.entity';

@Module({
	controllers: [UserController],
	providers: [UserService],
	imports: [
		TypeOrmModule.forFeature([User, Role, Wishlist, Basket]),
		MailModule,
	],
	exports: [UserService],
})
export class UserModule {}
