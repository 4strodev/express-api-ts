import { ApplicationError } from "./ApplicationError";
import { ErrorCode } from "./ErrorCode";

export class InfrastructureError extends ApplicationError {
	protected readonly errorCode = ErrorCode.INTERNAL_ERROR;

	constructor(message = "Error on application infrastructure") {
		super(message);
	}
}
