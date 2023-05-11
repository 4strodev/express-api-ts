import { ApplicationError } from "./ApplicationError";
import { ErrorCode } from "./ErrorCode";

export class UnexpectedError extends ApplicationError {
	protected readonly errorCode = ErrorCode.UNEXPECTED;

	constructor(message = "Unexpected error") {
		super(message);
	}
}
