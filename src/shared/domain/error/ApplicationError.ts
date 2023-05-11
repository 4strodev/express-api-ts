import { ErrorCode } from "./ErrorCode";

export abstract class ApplicationError extends Error {
	// rome-ignore lint: this will be logged, so we don't care about what type is
	metadata: any;
	protected abstract readonly errorCode: ErrorCode;

	// rome-ignore lint: this will be logged, so we don't care about what type is
	withMetadata(metadata: any): ApplicationError {
		this.metadata = metadata;
		return this;
	}
}
