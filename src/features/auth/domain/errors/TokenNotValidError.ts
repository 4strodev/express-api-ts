import { ApplicationError } from "../../../../shared/domain/error/ApplicationError";
import { ErrorCode } from "../../../../shared/domain/error/ErrorCode";

export class TokenNotValidError extends ApplicationError {
	protected readonly errorCode: ErrorCode = ErrorCode.BAD_REQUEST;

	constructor(message = "Token not valid") {
		super(message);
	}
}
