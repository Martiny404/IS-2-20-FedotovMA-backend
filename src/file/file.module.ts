import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TokenModule } from 'src/token/token.module';

@Module({
	providers: [FileService],
	controllers: [FileController],
	imports: [
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', '..', '/static'),
			serveRoot: '/static',
		}),
		TokenModule,
	],
})
export class FileModule {}
