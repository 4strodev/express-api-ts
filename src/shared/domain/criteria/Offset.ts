import { IntegerValueObject } from "../value-object/IntegerValueObject";
import { InvalidArgumentError } from "../error/InvalidArgumentError";

export class Offset extends IntegerValueObject {
	constructor(value: number) {
		super(value);
		this.ensureIsNotNegative(value);
	}

	private ensureIsNotNegative(value: number) {
		if (value < 0) {
			throw new InvalidArgumentError("Offset value cannot be negative");
		}
	}

	public static none(): Offset {
		return new Offset(0);
	}

	public isEmpty(): boolean {
		return this.value === 0;
	}
}
