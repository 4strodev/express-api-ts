import { Server } from "http";
import e from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { HttpController } from "./shared/infrastructure/HttpController";
import { injector } from "./shared/infrastructure/injector";
import { ApplicationError } from "./shared/domain/error/ApplicationError";
import { HttpResponse } from "./shared/infrastructure/http/HttpResponse";
import { ValidationError } from "express-validation";
import { ErrorCode } from "./shared/domain/error/ErrorCode";
import { CreateDefaultUserAction } from "./features/users/application/CreateDefaultUserAction";

/**
 * This is the main class that launch the http server and starts the api
 */
export class App {
	private server: Server;
	private readonly app: e.Express;

	constructor() {
		this.app = this.initApp();
		this.server = new Server(this.app);
	}

	/**
	 * This method creates an express app and return it
	 * @private
	 */
	private initApp(): e.Express {
		const app = e();

		this.attachMiddlewares(app);

		return app;
	}

	/**
	 * This method attach the corresponding middlewares like
	 * - morgan
	 * - helmet
	 * - cors
	 * - json parser
	 * - etc.
	 * @param app
	 * @private
	 */
	private attachMiddlewares(app: e.Express): void {
		app.use(helmet());
		app.use(morgan("dev"));
		app.use(e.json());
		app.use(
			cors({
				origin: "*",
			}),
		);
	}

	/**
	 * This method attach application controllers
	 * @private
	 * @param controller
	 */
	public attachController(controller: HttpController): void {
		controller.initRoutes(this.app);
	}

	public setDefaultErrorHandler() {
		this.app.use((err: Error, req: e.Request, res: e.Response, next: e.NextFunction) => {
			if (process.env.NODE_ENV === "development") {
				console.error(err);
			}

			if (err instanceof ApplicationError) {
				// Logging error
				injector.logger.error(err.message);
				const msg = err.message;

				if (err.metadata) {
					if (err.metadata instanceof Error) {
						injector.logger.warn(err.metadata.message);
					} else {
						injector.logger.warn(err.metadata.toString());
					}
				}

				// Generating response
				const response: HttpResponse<{}> = {
					msg,
					data: {},
					error_code: "002",
					success: false,
				};

				// Sending response
				return res.status(500).json(response);
			}

			if (err instanceof ValidationError) {
				const response: HttpResponse<object> = {
					data: err.details,
					msg: err.message,
					error_code: ErrorCode.BAD_REQUEST,
					success: false,
				};

				return res.status(err.statusCode).json(response);
			}

			// Showing error stack
			injector.logger.error(err.stack || "");

			// TODO here can create an alert for developers may can use RabbitMQ
			const response: HttpResponse<{}> = {
				success: false,
				msg: "Unexpected error",
				error_code: ErrorCode.UNEXPECTED,
				data: {},
			};
			return res.status(500).json(response);
		});
	}

	/**
	 * Launches the application in the specified port
	 * @param port
	 */
	listen(port: number): void {
		this.server.listen(port, () => {
			injector.logger.info(`Server running on port ${port}`);
		});
	}

	/**
	 * Executes initial configuration for application
	 */
	async bootstrap(): Promise<void> {
		await CreateDefaultUserAction.run(injector);
	}
}
