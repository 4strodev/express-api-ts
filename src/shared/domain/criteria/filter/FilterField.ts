import { StringValueObject } from "../../value-object/StringValueObject";
import { InvalidArgumentError } from "../../error/InvalidArgumentError";

export class FilterField extends StringValueObject {
	constructor(value: string) {
		super(value);
		this.ensureIsNotEmpty(value);
	}

	private ensureIsNotEmpty(value: string) {
		if (value === "") {
			throw new InvalidArgumentError("Filter field cannot be empty");
		}
	}
}
