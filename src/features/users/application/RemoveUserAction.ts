import { Injector } from "../../../shared/infrastructure/injector";
import { Criteria } from "../../../shared/domain/criteria/Criteria";
import { BadRequestError } from "../../../shared/domain/error/BadRequestError";
import { Filter } from "../../../shared/domain/criteria/filter/Filter";
import { FilterField } from "../../../shared/domain/criteria/filter/FilterField";
import {
	FilterOperator,
	FilterOperators,
} from "../../../shared/domain/criteria/filter/FilterOperator";
import { FilterValue } from "../../../shared/domain/criteria/filter/FilterValue";
import { UserIdNotDefinedError } from "../domain/error/UserIdNotDefinedError";

export class RemoveUserAction {
	static async run(injector: Injector, usersCriteria: Criteria) {
		if (!usersCriteria.hasFilters()) {
			throw new BadRequestError("Filters are required to remove a user");
		}

		// Removing tokens associated to these users
		const usersToRemove = await injector.userRepository.find(usersCriteria);
		if (!(usersToRemove.length > 0)) {
			// If there are no users then exit
			return;
		}
		// User getting user ids from fetched users
		const userIds = usersToRemove.map((user) => {
			if (!user.id) {
				throw new UserIdNotDefinedError("Cannot remove user because it don't have an id");
			}

			return user.id.value;
		});

		// Creating criteria to remove tokens
		const userIdsCriteria = new Criteria([
			new Filter(
				new FilterField("user_id"),
				new FilterOperator(FilterOperators.IN),
				new FilterValue(userIds),
			),
		]);
		await injector.authRepository.delete(userIdsCriteria);

		// Removing users
		await injector.userRepository.remove(usersCriteria);
	}
}
