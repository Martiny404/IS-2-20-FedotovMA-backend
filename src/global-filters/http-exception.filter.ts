import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(HttpExceptionFilter.name);

	constructor(private readonly configService: ConfigService) {}

	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus();

		const isProductionMode =
			this.configService.get<string>('NODE_ENV') === 'production';

		this.logger.error(`Exception: ${exception.message}, status: ${status}`);

		response.status(status).json(
			isProductionMode
				? {
						status: status,
						timestamp: new Date().toISOString(),
						message: exception.message,
				  }
				: {
						status: status,
						timestamp: new Date().toISOString(),
						message: exception.message,
						stacktrace: exception.stack,
				  }
		);
	}
}
