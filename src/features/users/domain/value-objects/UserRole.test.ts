import { describe, expect, test } from "@jest/globals";
import { ValueValid } from "../../../../shared/domain/utils/test-types";
import { UserRole } from "./UserRole";

describe("Testing user role instantiation", () => {
	test("Testing from values", () => {
		const roles: Array<ValueValid<string>> = [
			{
				value: "ADMIN",
				valid: true,
			},
			{
				value: "CUSTOMER",
				valid: false,
			},
			{
				value: "GUEST",
				valid: false,
			},
		];

		for (const role of roles) {
			if (role.valid) {
				expect(() => UserRole.fromValue(role.value)).not.toThrow();
			} else {
				expect(() => UserRole.fromValue(role.value)).toThrow();
			}
		}
	});
});
