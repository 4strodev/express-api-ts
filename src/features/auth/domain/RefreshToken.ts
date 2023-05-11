import { Token } from "./Token";
import { User } from "../../users/domain/User";
import { InvalidArgumentError } from "../../../shared/domain/error/InvalidArgumentError";
import { TokenType, TokenTypes } from "./value-objects/TokenType";
import moment from "moment/moment";

export class RefreshToken extends Token {
	constructor(user: User) {
		if (!user.id) {
			throw new InvalidArgumentError("User id must be defined");
		}

		super(
			user.id,
			user.username,
			user.email,
			user.userRole,
			new TokenType(TokenTypes.REFRESH),
			moment().add(6, "hours").unix(),
		);
	}
}
