import e from "express";
import { TokenNotGivenError } from "../../domain/errors/TokenNotGivenError";
import { BadRequestError } from "../../../../shared/domain/error/BadRequestError";
import { VerifyTokenAction } from "../../application/VerifyTokenAction";
import { TokenType, TokenTypes } from "../../domain/value-objects/TokenType";
import { injector } from "../../../../shared/infrastructure/injector";

/**
 * This middleware verifies access token. Ensure is passed with desired format and verifies its payload.
 * @param req
 * @param res
 * @param next
 */
export async function verifyAccessTokenMiddleware(
	req: e.Request,
	res: e.Response,
	next: e.NextFunction,
) {
	const bearerToken = req.headers.authorization;
	if (!bearerToken) {
		throw new TokenNotGivenError("Token not provided");
	}

	const [bearer, token] = bearerToken.split(" ");
	if (bearer !== "Bearer") {
		throw new BadRequestError("Token must be passed as 'Bearer <token>'");
	}

	if (!token) {
		throw new TokenNotGivenError("Token must be passed after 'Bearer'");
	}

	// Verifying access token
	await VerifyTokenAction.run(injector, token, new TokenType(TokenTypes.ACCESS));

	res.locals.token = token;

	return next();
}
