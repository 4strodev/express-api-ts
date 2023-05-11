import { describe, expect, test } from "@jest/globals";
import { ValueValid } from "../../../../shared/domain/utils/test-types";
import { InvalidArgumentError } from "../../../../shared/domain/error/InvalidArgumentError";
import { UserFirstname } from "./UserFirstname";

describe("Testing user firstname", () => {
	test("Testing firstname instantiation", () => {
		const names: Array<ValueValid<string>> = [
			{ valid: false, value: "" },
			{ valid: true, value: "John" },
		];

		for (const name of names) {
			if (!name.valid) {
				expect(() => new UserFirstname(name.value)).toThrow(InvalidArgumentError);
			} else {
				expect(() => new UserFirstname(name.value)).not.toThrow();
			}
		}
	});
});
