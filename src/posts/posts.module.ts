import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Posts } from './posts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	providers: [PostsService],
	controllers: [PostsController],
	imports: [TypeOrmModule.forFeature([Posts])],
})
export class PostsModule {}
