import { expect, describe, test } from "@jest/globals";
import { Password } from "./Password";
import { InvalidArgumentError } from "../../../../shared/domain/error/InvalidArgumentError";
import { ValueValid } from "../../../../shared/domain/utils/test-types";

describe("Testing password initialization", () => {
	test("Testing password none", () =>
		expect(Password.none().value).toEqual(Password.NONE_PASSWORD_VALUE));

	test("Testing password strength checking", () => {
		const passwords: Array<ValueValid<string>> = [
			{ valid: false, value: "" },
			{ valid: false, value: "1234" },
			{ valid: false, value: "P@ssword" },
			{ valid: true, value: "book tree stupid computer" },
			{ valid: true, value: "17dcdd72efb9e902ce2cd9430f045aae" },
		];

		for (const password of passwords) {
			if (!password.valid) {
				expect(() => new Password(password.value)).toThrow(InvalidArgumentError);
			} else {
				expect(() => new Password(password.value)).not.toThrow();
			}
		}
	});

	test("Testing random password", () => {
		expect(() => Password.random()).not.toThrow();
	});
});
