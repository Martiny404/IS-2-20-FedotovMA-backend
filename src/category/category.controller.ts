import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Post('/')
	async create(@Body() dto: CreateCategoryDto) {
		const category = await this.categoryService.create(dto);
		return category;
	}

	@Patch('/update/:id')
	async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
		return this.categoryService.update(+id, dto);
	}

	@Delete('/remove/:id')
	async remove(@Param('id') id: string) {
		return this.categoryService.remove(+id);
	}

	@Get('/all')
	async getAll() {
		return this.categoryService.getAll();
	}
	@Get('/:id')
	async byId(@Param('id') id: string) {
		return this.categoryService.byId(+id);
	}

	@Get('/info/:id')
	async getInfo(@Param('id') id: string) {
		return this.categoryService.getInfo(+id);
	}

	@Get('/all-options/:id')
	async getAllOptions(@Param('id') id: string) {
		return this.categoryService.getAllOptions(+id);
	}

	@Post('/remove-option/:id')
	async removeOption(
		@Param('id') id: string,
		@Body('optionId') optionId: number
	) {
		return this.categoryService.removeOption(+id, optionId);
	}

	@Post('/add-options/:id')
	async addOption(@Param('id') id: string, @Body('optionId') optionId: number) {
		return this.categoryService.addOption(+id, optionId);
	}

	@Get('/:name')
	async byName(@Param('name') name: string) {
		return this.categoryService.byName(name);
	}
}
