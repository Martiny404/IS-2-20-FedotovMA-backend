import {
	Controller,
	HttpCode,
	Post,
	Query,
	UploadedFile,
	UseFilters,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CheckAuth } from 'src/decorators/auth.decorator';
import { HttpExceptionFilter } from 'src/global-filters/http-exception.filter';
import { FileService } from './file.service';

@UseFilters(HttpExceptionFilter)
@Controller('file')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@Post()
	@HttpCode(200)
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
		@Query('folder') folder?: string
	) {
		return this.fileService.saveFiles([file], folder);
	}
}
