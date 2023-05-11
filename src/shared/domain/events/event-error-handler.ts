import { ApplicationError } from "../error/ApplicationError";
import { injector } from "../../infrastructure/injector";

const logger = injector.logger;

export function eventErrorHandler(error: unknown) {
	if (error instanceof Error) {
		logger.error(error.message);
		// If error has metadata log it
		if (error instanceof ApplicationError && error.metadata) {
			logger.warn(`${error.metadata}`);
		}
	} else {
		console.log(error);
	}
}
