import { StringValueObject } from "../../../../shared/domain/value-object/StringValueObject";
import { InvalidArgumentError } from "../../../../shared/domain/error/InvalidArgumentError";

export class Username extends StringValueObject {
	constructor(value: string) {
		super(value);
		this.ensureIsNotEmpty(value);
	}

	private ensureIsNotEmpty(value: string) {
		if (value === "") {
			throw new InvalidArgumentError("Username cannot be empty");
		}
	}
}
