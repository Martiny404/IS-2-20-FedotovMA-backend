import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/global-filters/http-exception.filter';
import { StatisticsService } from './statistics.service';

@UseFilters(HttpExceptionFilter)
@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@Get('/count-op')
	async countOrdersProducts(@Query() query: Record<string, string>) {
		const category = query?.category ?? '';
		const brand = query?.brand ?? '';

		return this.statisticsService.countOrdersProducts(category, brand);
	}

	@Get('/by-date-range')
	async getOrdersByDateRange(@Query() query: Record<string, string>) {
		const startRange = query?.startRange ?? '';
		const endRange = query?.endRange ?? '';
		return this.statisticsService.getOrdersByDateRange(startRange, endRange);
	}
}
