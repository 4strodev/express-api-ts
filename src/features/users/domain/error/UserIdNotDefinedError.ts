import { ApplicationError } from "../../../../shared/domain/error/ApplicationError";
import { ErrorCode } from "../../../../shared/domain/error/ErrorCode";

export class UserIdNotDefinedError extends ApplicationError {
	protected readonly errorCode: ErrorCode = ErrorCode.INTERNAL_ERROR;

	constructor(message = "User id not defined") {
		super(message);
	}
}
