import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './global-filters/all-exceptions.filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');

	app.enableCors({
		credentials: true,
		origin: 'http://localhost:3000',
	});

	const PORT = process.env.PORT ?? 5000;

	const httpAdapterHost = app.get(HttpAdapterHost);
	app.useGlobalPipes(new ValidationPipe());

	app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

	app.use(cookieParser());

	await app.listen(PORT, () =>
		console.log('Server successfully started on PORT: ' + PORT)
	);
}
bootstrap();
