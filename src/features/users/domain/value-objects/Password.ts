import { StringValueObject } from "../../../../shared/domain/value-object/StringValueObject";
import zxcvbn from "zxcvbn";
import { InvalidArgumentError } from "../../../../shared/domain/error/InvalidArgumentError";
import * as crypto from "crypto";

export class Password extends StringValueObject {
	static readonly NONE_PASSWORD_VALUE = "Accommodation Extravagance Phenomenology Antithetical";

	constructor(value: string) {
		super(value);
		this.ensurePasswordMatchRequirements(value);
	}

	private ensurePasswordMatchRequirements(value: string) {
		const result = zxcvbn(value);
		if (result.score < 3) {
			throw new InvalidArgumentError(`Password is to weak strength punctuation ${result.score}`);
		}
	}

	/**
	 * Creates a default empty password. Creates a default password that match de default password requirements.
	 *
	 * This default password will be used as an empty password.
	 */
	public static none(): Password {
		return new Password(Password.NONE_PASSWORD_VALUE);
	}

	/**
	 * Creates a random password
	 */
	public static random(): Password {
		const PASSWORD_LENGTH = 10;
		const randomString = crypto.randomBytes(20).toString("hex");
		const md5Hash = crypto.createHash("md5").update(randomString).digest("hex");

		return new Password(md5Hash.slice(-PASSWORD_LENGTH));
	}
}
