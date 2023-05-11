import e from "express";
import { InvalidArgumentError } from "../../domain/error/InvalidArgumentError";
import { Criteria } from "../../domain/criteria/Criteria";
import { InfrastructureError } from "../../domain/error/InfrastructureError";
import { FilterOperator } from "../../domain/criteria/filter/FilterOperator";
import { Filter } from "../../domain/criteria/filter/Filter";
import { FilterField } from "../../domain/criteria/filter/FilterField";
import { FilterValue } from "../../domain/criteria/filter/FilterValue";
import { Order } from "../../domain/criteria/order/Order";
import { OrderType } from "../../domain/criteria/order/OrderType";
import { OrderBy } from "../../domain/criteria/order/OrderBy";
import { Limit } from "../../domain/criteria/Limit";
import { Offset } from "../../domain/criteria/Offset";
import { BadRequestError } from "../../domain/error/BadRequestError";

export interface FilterSchema {
	field: string;
	value: "string" | "float" | "integer" | "boolean" | "date";
}

type FilterType = {
	field?: string;
	operator?: string;
	value?: string | Array<string>;
};

function toInteger(value: string): number {
	const parsedValue = parseInt(value);
	if (isNaN(parsedValue)) {
		throw new InvalidArgumentError("Value is not a valid integer");
	}

	return parsedValue;
}

function toFloat(value: string): number {
	const parsedValue = parseFloat(value);
	if (isNaN(parsedValue)) {
		throw new InvalidArgumentError("Value is not a valid integer");
	}

	return parsedValue;
}

function toDate(value: string): Date {
	let timestamp: number;
	try {
		timestamp = toInteger(value);
	} catch (err) {
		throw new InvalidArgumentError("Date must be a timestamp");
	}

	return new Date(timestamp);
}

function toBool(value: string): boolean {
	if (value === "true") {
		return true;
	}
	if (value === "false") {
		return false;
	}

	throw new InvalidArgumentError("Provided value is not a valid boolean");
}

function mapFilterValue(value: string, schema: FilterSchema): number | string | Date | boolean {
	switch (schema.value) {
		case "float":
			return toFloat(value);
		case "integer":
			return toInteger(value);
		case "boolean":
			return toBool(value);
		case "date":
			return toDate(value);
		default:
			return value;
	}
}

function parseFilters(params: Array<FilterType>, schema: Array<FilterSchema>): Array<Filter> {
	return params.map((filterMap) => {
		let filterField: FilterField;
		let filterOperator: FilterOperator;
		let filterValue: FilterValue;

		// Getting field name
		const fieldName = filterMap.field;
		if (!fieldName) {
			throw new InfrastructureError("Error parsing filters");
		}
		filterField = new FilterField(fieldName);

		// Getting schema
		const filterSchema = schema.find((filterSchema) => filterSchema.field === fieldName);
		if (!filterSchema) {
			throw new InvalidArgumentError(`Filter field ${fieldName} is not valid`);
		}

		// Parsing filter value
		const value = filterMap.value;
		if (!value) {
			throw new InvalidArgumentError("Filter value not provided");
		}
		if (value.constructor === Array) {
			filterValue = new FilterValue(
				value.map((rawValue) => mapFilterValue(rawValue, filterSchema)),
			);
		} else {
			filterValue = new FilterValue(mapFilterValue(value as string, filterSchema));
		}

		// Parsing operator
		const operator = filterMap.operator;
		if (!operator) {
			throw new InvalidArgumentError("Filter operator not provided");
		}
		filterOperator = FilterOperator.fromValue(operator);

		return new Filter(filterField, filterOperator, filterValue);
	});
}

export function parseFiltersFromRequest(request: e.Request, schema: Array<FilterSchema>): Criteria {
	const { filters, order_by, order_type, limit: query_limit, offset: query_offset } = request.query;
	const filterMaps = filters as Array<FilterType>;
	const parsedFilters = filterMaps ? parseFilters(filterMaps, schema) : [];
	let order: Order = Order.none();
	let limit: Limit;
	let offset: Offset;

	if (order_by) {
		if (schema.map((filterSchema) => filterSchema.field).includes(order_by as string)) {
			if (order_type) {
				order = new Order(
					new OrderBy(order_by as string),
					OrderType.fromValue(order_type as string),
				);
			} else {
				order = new Order(new OrderBy(order_by as string), OrderType.none());
			}
		} else {
			throw new BadRequestError("Order by not valid");
		}
	}

	const parsedLimit = parseInt(query_limit as string);
	if (!parsedLimit) {
		limit = Limit.none();
	} else {
		limit = new Limit(parsedLimit);
	}

	const parsedOffset = parseInt(query_offset as string);
	if (!parsedOffset) {
		offset = Offset.none();
	} else {
		offset = new Offset(parsedOffset);
	}

	return new Criteria(parsedFilters, order, limit, offset);
}
