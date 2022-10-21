import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FileResponse } from './file.interface';
import { join } from 'path';
import { access, writeFile, mkdir } from 'fs/promises';

@Injectable()
export class FileService {
	async saveFiles(files: Express.Multer.File[], folder = 'default') {
		const uploadFolder = join(__dirname, '..', '..', 'static', folder);

		try {
			await access(uploadFolder);
		} catch (e) {
			await mkdir(uploadFolder, { recursive: true });
		}

		const res: FileResponse[] = await Promise.all(
			files.map(async (file): Promise<FileResponse> => {
				try {
					await writeFile(join(uploadFolder, file.originalname), file.buffer);
				} catch (e) {
					throw new InternalServerErrorException('Ошибка при записи файлов');
				}
				return {
					url: `/static/${folder}/${file.originalname}`,
					name: file.originalname,
				};
			})
		);
		return res;
	}
}
