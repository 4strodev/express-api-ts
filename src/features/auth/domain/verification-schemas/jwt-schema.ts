import Joi from "joi";

export const jwtSchema = Joi.object({
	exp: Joi.date().required(),
	id: Joi.number().required(),
	role: Joi.string().required(),
	username: Joi.string().required(),
	email: Joi.string().required(),
	token: Joi.string().required(),
	iat: Joi.date().required(),
});
