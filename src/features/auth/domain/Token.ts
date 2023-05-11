import { UserId } from "../../users/domain/value-objects/UserId";
import { Username } from "../../users/domain/value-objects/Username";
import { Email } from "../../users/domain/value-objects/Email";
import { UserRole } from "../../users/domain/value-objects/UserRole";
import { JsonSerializer } from "../../../shared/domain/JsonSerializer";
import { TokenType } from "./value-objects/TokenType";
import { jwtSchema } from "./verification-schemas/jwt-schema";
import { BadRequestError } from "../../../shared/domain/error/BadRequestError";
import { InvalidArgumentError } from "../../../shared/domain/error/InvalidArgumentError";
import { User } from "../../users/domain/User";

export class Token implements JsonSerializer {
	get expirationTime(): number | undefined {
		return this._expirationTime;
	}

	get userId(): UserId {
		return this._id;
	}

	get username(): Username {
		return this._username;
	}
	get email(): Email {
		return this._email;
	}
	get tokenType(): TokenType {
		return this._tokenType;
	}
	get role(): UserRole {
		return this._role;
	}

	constructor(
		private _id: UserId,
		private _username: Username,
		private _email: Email,
		private _role: UserRole,
		private _tokenType: TokenType,
		private _expirationTime?: number,
	) {}

	serialize(): object {
		return {
			id: this._id.value,
			username: this._username.value,
			email: this._email.value,
			role: this._role.value,
			token: this._tokenType.value,
		};
	}

	public static fromObject(payload: any): Token {
		const result = jwtSchema.validate(payload, { dateFormat: "time" });
		if (result.error) {
			throw new InvalidArgumentError(result.error.message);
		}

		return new Token(
			new UserId(payload.id),
			new Username(payload.username),
			new Email(payload.email),
			new UserRole(payload.role),
			TokenType.fromValue(payload.token),
			payload.exp,
		);
	}
}
