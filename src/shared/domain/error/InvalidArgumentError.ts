import { ApplicationError } from "./ApplicationError";
import { ErrorCode } from "./ErrorCode";

export class InvalidArgumentError extends ApplicationError {
	constructor(message = "Invalid argument") {
		super(message);
	}

	protected readonly errorCode = ErrorCode.INTERNAL_ERROR;
}
