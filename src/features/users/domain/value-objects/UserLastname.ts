import { StringValueObject } from "../../../../shared/domain/value-object/StringValueObject";
import { InvalidArgumentError } from "../../../../shared/domain/error/InvalidArgumentError";

export class UserLastname extends StringValueObject {
	constructor(value: string) {
		super(value);
	}

	private ensureIsNotEmpty(value: string) {
		if (value === "") {
			throw new InvalidArgumentError("Lastname cannot be empty");
		}
	}
}
