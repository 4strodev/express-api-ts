import { Token } from "./Token";
import { User } from "../../users/domain/User";
import { TokenType, TokenTypes } from "./value-objects/TokenType";
import moment from "moment";
import { InvalidArgumentError } from "../../../shared/domain/error/InvalidArgumentError";

export class AccessToken extends Token {
	constructor(user: User) {
		let tokenDuration: number = 15;
		if (process.env['NODE_ENV'] === 'development') {
			tokenDuration = 120;
		}
		if (!user.id) {
			throw new InvalidArgumentError("User id must be defined");
		}

		super(
			user.id,
			user.username,
			user.email,
			user.userRole,
			new TokenType(TokenTypes.ACCESS),
			moment().add(tokenDuration, "minutes").unix(),
		);
	}
}
