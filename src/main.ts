import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	const PORT = process.env.PORT ?? 5000;

	app.useGlobalPipes(new ValidationPipe());

	await app.listen(PORT, () =>
		console.log('Server successfully started on PORT: ' + PORT)
	);
}
bootstrap();
