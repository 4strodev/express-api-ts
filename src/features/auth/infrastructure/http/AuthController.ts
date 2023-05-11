import { HttpController } from "../../../../shared/infrastructure/HttpController";
import e from "express";
import promiseRouter from "express-promise-router";
import { LoginAction } from "../../application/LoginAction";
import { Username } from "../../../users/domain/value-objects/Username";
import { Email } from "../../../users/domain/value-objects/Email";
import { Password } from "../../../users/domain/value-objects/Password";
import { HttpResponse } from "../../../../shared/infrastructure/http/HttpResponse";
import { LogoutAction } from "../../application/LogoutAction";
import { Joi, schema, validate } from "express-validation";
import { valid } from "joi";
import { injector } from "../../../../shared/infrastructure/injector";
import { RefreshToken } from "../../domain/RefreshToken";
import { RefreshTokenAction } from "../../application/RefreshTokenAction";
import { grokType } from "xmltojson";

const tokenBodyValidationSchema: schema = {
	body: Joi.object({
		token: Joi.string().required(),
	}),
};

export class AuthController implements HttpController {
	private readonly router: e.Router = promiseRouter();
	private readonly prefix = "/auth";

	initRoutes(app: e.Router): void {
		// Creating routes
		this.router.post("/login", this.login);
		this.router.delete("/logout", validate(tokenBodyValidationSchema), this.logout);
		this.router.post("/refresh", validate(tokenBodyValidationSchema), this.refreshToken);

		// Attaching router to application
		app.use(this.prefix, this.router);
	}

	async login(req: e.Request, res: e.Response, next: e.NextFunction) {
		const { username, email, password } = req.body;

		const domainUsername = username ? new Username(username) : undefined;
		const domainEmail = email ? new Email(email) : undefined;
		const domainPassword = password === "" ? Password.none() : new Password(password);

		const { accessToken, refreshToken } = await LoginAction.run(injector, {
			username: domainUsername,
			email: domainEmail,
			password: domainPassword,
		});

		const response = HttpResponse.success("Logged in successfully", {
			access_token: accessToken,
			refresh_token: refreshToken,
		});

		return res.json(response);
	}

	async logout(req: e.Request, res: e.Response, next: e.NextFunction) {
		const { token } = req.body;

		await LogoutAction.run(injector, token);
		const response = HttpResponse.success("Logged out successfully", undefined);
		return res.json(response);
	}

	async refreshToken(req: e.Request, res: e.Response, next: e.NextFunction) {
		const { token } = req.body;
		const accessToken = await RefreshTokenAction.run(injector, token);
		return res.json({ accessToken });
	}
}
