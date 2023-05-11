import { Criteria } from "../../domain/criteria/Criteria";
import { Primitives } from "../../domain/value-object/ValueObject";
import { OrderType } from "../../domain/criteria/order/OrderType";
import { FilterOperators } from "../../domain/criteria/filter/FilterOperator";
import { InvalidArgumentError } from "../../domain/error/InvalidArgumentError";

/**
 * Surround filter names with '`'
 *
 * If filter name is something like 'table.column' then the result is
 * '\`table\`.\`column\`'
 * @param name
 */
function surroundName(name: string): string {
	return name
		.split(".")
		.map((field) => `\`${field}\``)
		.join(".");
}

export function convertCriteriaToSql(criteria: Criteria): [string, Array<Primitives>] {
	const parameters: Array<Primitives> = [];
	let fullSqlStatement = "";

	let sqlFilter = "";

	if (criteria.hasFilters()) {
		// Parsing filters
		sqlFilter = criteria.filters
			.map((filter) => {
				if (filter.filterOperator.value === FilterOperators.IS_NULL) {
					return `${surroundName(filter.filterField.value)} IS NULL`;
				}

				if (filter.filterOperator.value === FilterOperators.LIKE) {
					if (filter.filterValue.value.constructor === Array) {
						throw new InvalidArgumentError(
							`Cannot use ${filter.filterOperator.value} and array value!`,
						);
					}
					parameters.push(`%${filter.filterValue.value as Primitives}%`);
					return `${surroundName(filter.filterField.value)} LIKE ?`;
				}

				if (filter.filterValue.value.constructor === Array) {
					for (const valueElement of filter.filterValue.value) {
						parameters.push(valueElement);
					}
					const placeholder = filter.filterValue.value.map((_) => "?").join(", ");
					return `${surroundName(filter.filterField.value)} ${
						filter.filterOperator.value
					} (${placeholder})`;
				}
				parameters.push(filter.filterValue.value as Primitives);
				return `${surroundName(filter.filterField.value)} ${filter.filterOperator.value} ?`;
			})
			.join(" AND ");

		sqlFilter = `WHERE ${sqlFilter}`;
	}

	// Parsing order
	let sqlOrder = "";
	if (!criteria.order.orderType.equals(OrderType.none())) {
		sqlOrder = `ORDER BY ${surroundName(criteria.order.orderBy.value)} ${
			criteria.order.orderType.value
		}`;
	}

	fullSqlStatement = `${sqlFilter} ${sqlOrder}`;

	// Parsing limit and offset
	let sqlLimit = "";
	if (criteria.limit.isEmpty()) {
		return [fullSqlStatement, parameters];
	}
	sqlLimit = `LIMIT ${criteria.limit.value}`;

	if (!criteria.offset.isEmpty()) {
		sqlLimit = `${sqlLimit} OFFSET ${criteria.offset.value}`;
	}

	// Creating full sql statement
	fullSqlStatement = `${fullSqlStatement} ${sqlLimit}`;
	return [fullSqlStatement, parameters];
}
