import { ApplicationError } from "./ApplicationError";
import { ErrorCode } from "./ErrorCode";

export class NotImplementedError extends ApplicationError {
	protected readonly errorCode: ErrorCode = ErrorCode.INTERNAL_ERROR;

	constructor(message = "Feature not implemented") {
		super(message);
	}
}
