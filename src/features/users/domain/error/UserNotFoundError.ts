import { ApplicationError } from "../../../../shared/domain/error/ApplicationError";
import { ErrorCode } from "../../../../shared/domain/error/ErrorCode";

export class UserNotFoundError extends ApplicationError {
	protected readonly errorCode: ErrorCode = ErrorCode.BAD_REQUEST;

	constructor(message = "User not found") {
		super(message);
	}
}
