import { ApplicationError } from "../../../../shared/domain/error/ApplicationError";
import { ErrorCode } from "../../../../shared/domain/error/ErrorCode";

export class PasswordNotEncryptedError extends ApplicationError {
	protected readonly errorCode: ErrorCode = ErrorCode.INTERNAL_ERROR;

	constructor(message = "Password not encrypted") {
		super(message);
	}
}
