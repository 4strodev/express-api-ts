import { EnumValueObject } from "../../../../shared/domain/value-object/EnumValueObject";
import { InvalidArgumentError } from "../../../../shared/domain/error/InvalidArgumentError";

export enum UserRoles {
	ADMIN = "ADMIN",
}

export class UserRole extends EnumValueObject<UserRoles> {
	constructor(userRole: UserRoles) {
		super(userRole, Object.values(UserRoles));
	}

	public static fromValue(value: string): UserRole {
		for (const userRole of Object.values(UserRoles)) {
			if (value === userRole.toString()) {
				return new UserRole(userRole);
			}
		}

		throw new InvalidArgumentError(`User role ${value} not valid`);
	}

	protected throwErrorForInvalidValue(value: UserRoles): void {
		throw new InvalidArgumentError(`User role ${value} not valid`);
	}
}
