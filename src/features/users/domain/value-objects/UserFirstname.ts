import { StringValueObject } from "../../../../shared/domain/value-object/StringValueObject";
import { InvalidArgumentError } from "../../../../shared/domain/error/InvalidArgumentError";

export class UserFirstname extends StringValueObject {
	constructor(value: string) {
		super(value);
		this.ensureIsNotEmpty(value);
	}

	/**
	 * We don't want that user first name is empty
	 * @param value
	 * @private
	 */
	private ensureIsNotEmpty(value: string): void {
		if (value === "") {
			throw new InvalidArgumentError("Firstname cannot be empty");
		}
	}
}
