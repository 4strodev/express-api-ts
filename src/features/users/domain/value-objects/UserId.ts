import { IntegerValueObject } from "../../../../shared/domain/value-object/IntegerValueObject";
import { InvalidArgumentError } from "../../../../shared/domain/error/InvalidArgumentError";

export class UserId extends IntegerValueObject {
	/**
	 * Creates a user id value object
	 * @param value it must be an integer
	 */
	constructor(value: number) {
		super(value);
		this.ensureIsValidId(value);
	}

	private ensureIsValidId(value: number) {
		if (value <= 0) {
			throw new InvalidArgumentError("Id must be a positive number");
		}
	}
}
