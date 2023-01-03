import { Transform } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { IFilter, ISortBy, ISortType } from 'src/types/producr-filter.types';
import {
	JsonTransform,
	toBoolean,
	toISortBy,
	toISortType,
	toNumber,
} from 'src/utils/transformQueryParams';

export class CatalogDto {
	@Transform(({ value }) => toNumber(value))
	@IsOptional()
	@IsNumber()
	categoryId?: number;

	@Transform(({ value }) => toNumber(value))
	@IsOptional()
	@IsNumber()
	brandId?: number;

	@Transform(({ value }) => toBoolean(value))
	@IsOptional()
	@IsBoolean()
	discount?: boolean;

	@Transform(({ value }) => toISortBy(value))
	@IsOptional()
	@IsString()
	sort?: ISortBy = ISortBy.VIEWS;

	@Transform(({ value }) => toISortType(value))
	@IsOptional()
	@IsString()
	type?: ISortType = ISortType.ASC;

	@Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
	@IsOptional()
	@IsNumber()
	page?: number = 1;

	@Transform(({ value }) => JsonTransform(value))
	@IsOptional()
	filters?: IFilter[] = [];
}
