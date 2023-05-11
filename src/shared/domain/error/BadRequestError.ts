import { ApplicationError } from "./ApplicationError";
import { ErrorCode } from "./ErrorCode";

export class BadRequestError extends ApplicationError {
	protected readonly errorCode: ErrorCode = ErrorCode.BAD_REQUEST;

	constructor(message = "Bad request error") {
		super(message);
	}
}
