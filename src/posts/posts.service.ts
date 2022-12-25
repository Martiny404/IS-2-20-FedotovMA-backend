import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from './posts.entity';

@Injectable()
export class PostsService {
	constructor(
		@InjectRepository(Posts) private readonly postsRepo: Repository<Posts>
	) {}

	async getAllPosts() {
		const posts = await this.postsRepo.find();

		return posts;
	}

	async getOnePost(postId: number) {
		const post = await this.postsRepo.findOne({
			where: {
				id: postId,
			},
		});
		if (!post) {
			throw new NotFoundException('Поста не существует!');
		}
		return post;
	}

	async removePost(postId: number) {
		const post = await this.postsRepo.findOne({
			where: {
				id: postId,
			},
		});
		if (!post) {
			throw new NotFoundException('Поста не существует!');
		}
		await this.postsRepo.remove(post);
		return true;
	}

	async editPost(postId: number, dto: UpdatePostDto) {
		const post = await this.postsRepo.findOne({
			where: {
				id: postId,
			},
		});
		if (!post) {
			throw new NotFoundException('Поста не существует!');
		}

		return await this.postsRepo.save({
			...post,
			...dto,
		});
	}

	async createPost(dto: CreatePostDto) {
		const newPost = this.postsRepo.create({
			theme: dto.theme,
			poster: dto.poster,
			text: dto.text,
		});
		return await this.postsRepo.save(newPost);
	}
}
