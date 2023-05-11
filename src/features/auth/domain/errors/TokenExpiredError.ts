import { ApplicationError } from "../../../../shared/domain/error/ApplicationError";
import { ErrorCode } from "../../../../shared/domain/error/ErrorCode";

export class TokenExpiredError extends ApplicationError {
	protected readonly errorCode: ErrorCode = ErrorCode.UNAUTHORIZED;

	constructor(message = "Token expired") {
		super(message);
	}
}
