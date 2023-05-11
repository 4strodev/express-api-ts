import { Joi, schema } from "express-validation";
import { FilterOperators } from "../../domain/criteria/filter/FilterOperator";
import { OrderTypes } from "../../domain/criteria/order/OrderType";

export const filterSchema: schema = {
	query: Joi.object({
		filters: Joi.array().items(
			Joi.object({
				field: Joi.string().required(),
				operator: Joi.string()
					.required()
					.allow(...Object.values(FilterOperators)),
				value: Joi.alternatives()
					.try(
						Joi.number(),
						Joi.string(),
						Joi.boolean(),
						Joi.array().items(Joi.number(), Joi.string(), Joi.boolean()),
					)
					.required(),
			}),
		),
		order_by: Joi.string().min(1),
		order_type: Joi.string().allow(...Object.values(OrderTypes)),
		limit: Joi.number().min(0),
		offset: Joi.number().min(0),
	}),
};
