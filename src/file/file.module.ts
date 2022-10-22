import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
	providers: [FileService],
	controllers: [FileController],
	imports: [
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', '..', '/static'),
			serveRoot: '/static',
		}),
	],
})
export class FileModule {}
