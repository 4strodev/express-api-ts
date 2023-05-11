import { Criteria } from "../../../../shared/domain/criteria/Criteria";
import { Filter } from "../../../../shared/domain/criteria/filter/Filter";
import { FilterField } from "../../../../shared/domain/criteria/filter/FilterField";
import {
	FilterOperator,
	FilterOperators,
} from "../../../../shared/domain/criteria/filter/FilterOperator";
import { FilterValue } from "../../../../shared/domain/criteria/filter/FilterValue";
import { Order } from "../../../../shared/domain/criteria/order/Order";
import { Limit } from "../../../../shared/domain/criteria/Limit";
import { UserId } from "../value-objects/UserId";

export class ByUserIdCriteria extends Criteria {
	constructor(id: UserId) {
		super(
			[
				new Filter(
					new FilterField("id"),
					new FilterOperator(FilterOperators.EQUAL),
					new FilterValue(id.value),
				),
			],
			Order.none(),
			new Limit(1),
		);
	}
}
