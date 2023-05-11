import { EnumValueObject } from "../../../../shared/domain/value-object/EnumValueObject";
import { InvalidArgumentError } from "../../../../shared/domain/error/InvalidArgumentError";

export enum TokenTypes {
	ACCESS = "ACCESS",
	REFRESH = "REFRESH",
}

export class TokenType extends EnumValueObject<TokenTypes> {
	constructor(tokenType: TokenTypes) {
		super(tokenType, Object.values(TokenTypes));
	}

	public static fromValue(value: string) {
		for (const tokenType of Object.values(TokenTypes)) {
			if (tokenType.toString() === value) {
				return new TokenType(tokenType);
			}
		}

		throw new InvalidArgumentError(`Token type '${value}' is not valid`);
	}

	protected throwErrorForInvalidValue(value: TokenTypes): void {
		throw new InvalidArgumentError(`Token type '${value}' is not valid`);
	}
}
