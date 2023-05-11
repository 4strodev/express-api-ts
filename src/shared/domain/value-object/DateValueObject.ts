import { ValueObject } from "./ValueObject";

export class DateValueObject extends ValueObject<Date> {
	constructor(value: Date) {
		super(value);
	}
}
