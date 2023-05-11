import { Criteria } from "../../../../shared/domain/criteria/Criteria";
import { Filter } from "../../../../shared/domain/criteria/filter/Filter";
import { Order } from "../../../../shared/domain/criteria/order/Order";
import { FilterField } from "../../../../shared/domain/criteria/filter/FilterField";
import {
	FilterOperator,
	FilterOperators,
} from "../../../../shared/domain/criteria/filter/FilterOperator";
import { FilterValue } from "../../../../shared/domain/criteria/filter/FilterValue";
import { Username } from "../value-objects/Username";
import { Limit } from "../../../../shared/domain/criteria/Limit";

/**
 * Takes single user identified by username
 */
export class ByUsernameCriteria extends Criteria {
	constructor(username: Username) {
		super(
			[
				new Filter(
					new FilterField("username"),
					new FilterOperator(FilterOperators.EQUAL),
					new FilterValue(username.value),
				),
			],
			Order.none(),
			new Limit(1),
		);
	}
}
