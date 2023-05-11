import { describe, expect, test } from "@jest/globals";
import { ValueValid } from "../../../../shared/domain/utils/test-types";
import { InvalidArgumentError } from "../../../../shared/domain/error/InvalidArgumentError";
import { Email } from "./Email";

describe("Testing email instantiation", () => {
	test("Testing multiple email formats", () => {
		const emails: Array<ValueValid<string>> = [
			{ valid: false, value: "" },
			{ valid: false, value: "obviously is not valid" },
			{ valid: true, value: "example@example.com" },
			{ valid: true, value: "example@example.ar.com" },
			{ valid: true, value: "example1234@example.ar.com" },
		];

		for (const email of emails) {
			if (!email.valid) {
				expect(() => new Email(email.value)).toThrow(InvalidArgumentError);
			} else {
				expect(() => new Email(email.value)).not.toThrow();
			}
		}
	});
});
