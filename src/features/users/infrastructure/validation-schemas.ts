import { Joi, schema } from "express-validation";
import { FilterOperators } from "../../../shared/domain/criteria/filter/FilterOperator";

export const userDataValidationSchema: schema = {
	body: Joi.object({
		username: Joi.string().required(),
		firstname: Joi.string().required(),
		lastname: Joi.string().required(),
		email: Joi.string().email().required(),
		passwd: Joi.string().required(),
	}),
};
