import { HttpController } from "../../../shared/infrastructure/HttpController";
import e from "express";
import { validate } from "express-validation";
import { User } from "../domain/User";
import { UserFirstname } from "../domain/value-objects/UserFirstname";
import { UserLastname } from "../domain/value-objects/UserLastname";
import { Email } from "../domain/value-objects/Email";
import { Password } from "../domain/value-objects/Password";
import { userDataValidationSchema } from "./validation-schemas";
import promiseRouter from "express-promise-router";
import { SaveUserAction } from "../application/SaveUserAction";
import { Username } from "../domain/value-objects/Username";
import { FindUsersAction } from "../application/FindUsersAction";
import { filterSchema } from "../../../shared/infrastructure/http/validation-schemas";
import { parseFiltersFromRequest } from "../../../shared/infrastructure/http/criteria-utils";
import { HttpResponse } from "../../../shared/infrastructure/http/HttpResponse";
import { verifyAccessTokenMiddleware } from "../../auth/infrastructure/http/verify-access-token.middleware";
import { getUsersFilterSchema } from "./filter-schemas/get-user-filter-schema";
import { injector } from "../../../shared/infrastructure/injector";
import { RemoveUserAction } from "../application/RemoveUserAction";
import {UserId} from "../domain/value-objects/UserId";
import {UpdateUserAction} from "../application/UpdateUserAction";

export class UserController implements HttpController {
	private readonly router: e.Router = promiseRouter();
	private readonly prefix = "/users";

	constructor() {}

	/**
	 * Init controller routes and attach to application
	 * @param app
	 */
	initRoutes(app: e.Router): void {
		// Initializing router routes
		this.router.post("/", validate(userDataValidationSchema), this.saveUser);
		this.router.get("/", validate(filterSchema), this.getUsers);
		this.router.delete("/", this.removeUsers);
		this.router.put("/:id(\\d+)", validate(userDataValidationSchema), this.updateUser);

		// Attaching router to app
		app.use(this.prefix, verifyAccessTokenMiddleware, this.router);
	}

	/**
	 * Return a simple message to user
	 * @param req
	 * @param res
	 */
	async saveUser(req: e.Request, res: e.Response, next: e.NextFunction) {
		const { username, firstname, lastname, email, passwd } = req.body;
		const user = new User(
			new Username(username as string),
			new UserFirstname(firstname as string),
			new UserLastname(lastname as string),
			new Email(email as string),
			new Password(passwd as string),
		);

		const savedUser = await SaveUserAction.run(injector, user);

		const response = HttpResponse.success("User saved successfully", savedUser.serialize());
		return res.json(response);
	}

	async getUsers(req: e.Request, res: e.Response, next: e.NextFunction) {
		const criteria = parseFiltersFromRequest(req, getUsersFilterSchema);
		const users = await FindUsersAction.run(injector, criteria);
		const response = HttpResponse.success(
			"Users fetched successfully",
			users.map((user) => user.serialize()),
		);
		return res.json(response);
	}

	async updateUser(req: e.Request, res: e.Response, next: e.NextFunction) {
		const { username, firstname, lastname, email, passwd } = req.body;
		const user = new User(
			new Username(username as string),
			new UserFirstname(firstname as string),
			new UserLastname(lastname as string),
			new Email(email as string),
			new Password(passwd as string),
		);
		user.withId(new UserId(parseInt(req.params.id)));
		const updatedUser = await UpdateUserAction.run(injector, user);
		const response = HttpResponse.success('User updated successfully', updatedUser.serialize());
		return res.json(response);
	}

	async removeUsers(req: e.Request, res: e.Response, next: e.NextFunction) {
		const criteria = parseFiltersFromRequest(req, getUsersFilterSchema);
		await RemoveUserAction.run(injector, criteria);
		const response = HttpResponse.success("Successful operation", undefined);
		return res.json(response);
	}
}
