import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { CheckAuth } from 'src/decorators/auth.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Get('/')
	async getAllPosts() {
		return this.postsService.getAllPosts();
	}

	@Get('/:id')
	async getOnePost(@Param('id') id: string) {
		return this.postsService.getOnePost(+id);
	}

	@CheckAuth('admin', true)
	@Post('/')
	async createPost(@Body() dto: CreatePostDto) {
		return this.postsService.createPost(dto);
	}

	@CheckAuth('admin', true)
	@Patch('/:id')
	async editPost(@Param('id') id: string, dto: UpdatePostDto) {
		return this.postsService.editPost(+id, dto);
	}

	@Post('/views/:id')
	async incrementViews(@Param('id') id: string) {
		return this.postsService.incrementViews(+id);
	}

	@CheckAuth('admin', true)
	@Delete('/:id')
	async deletePost(@Param('id') id) {
		return this.postsService.removePost(+id);
	}
}
