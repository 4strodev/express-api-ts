import { StringValueObject } from "../../../../shared/domain/value-object/StringValueObject";
import { InvalidArgumentError } from "../../../../shared/domain/error/InvalidArgumentError";
import { emailRegex } from "../../../../shared/domain/utils/regex";

export class Email extends StringValueObject {
	constructor(value: string) {
		super(value);
		this.ensureIsValidEmail(value);
	}

	private ensureIsValidEmail(value: string) {
		if (!emailRegex.test(value)) {
			throw new InvalidArgumentError(`Email ${value} not valid`);
		}
	}
}
