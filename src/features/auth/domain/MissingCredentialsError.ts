import { ApplicationError } from "../../../shared/domain/error/ApplicationError";
import { ErrorCode } from "../../../shared/domain/error/ErrorCode";

export class MissingCredentialsError extends ApplicationError {
	protected readonly errorCode: ErrorCode = ErrorCode.UNAUTHORIZED;

	constructor(message = "Missing credentials") {
		super(message);
	}
}
