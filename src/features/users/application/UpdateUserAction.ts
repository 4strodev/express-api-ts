import {Injector} from "../../../shared/infrastructure/injector";
import {User} from "../domain/User";
import {UserIdNotDefinedError} from "../domain/error/UserIdNotDefinedError";
import {PasswordUtils} from "../domain/PasswordUtils";
import {ByUsernameCriteria} from "../domain/criteria/ByUsernameCriteria";
import {Criteria} from "../../../shared/domain/criteria/Criteria";
import {NotRemovedFilter} from "../../../shared/domain/criteria/filter/common/NotRemovedFilter";
import {UserAlreadyExistsError} from "../domain/error/UserAlreadyExistsError";
import {ByEmailCriteria} from "../domain/criteria/ByEmailCriteria";
import {Filter} from "../../../shared/domain/criteria/filter/Filter";
import {FilterField} from "../../../shared/domain/criteria/filter/FilterField";
import {FilterOperator, FilterOperators} from "../../../shared/domain/criteria/filter/FilterOperator";
import {FilterValue} from "../../../shared/domain/criteria/filter/FilterValue";
import {ByUserIdCriteria} from "../domain/criteria/ByUserIdCriteria";
import {UserNotFoundError} from "../domain/error/UserNotFoundError";

export class UpdateUserAction {
	/**
	 * Update user and returns updated user
	 * @param user
	 */
	static async run(injector: Injector, user: User): Promise<User> {
		if (!user.id) {
			throw new UserIdNotDefinedError();
		}

		// Check if user exist
		const users = await injector.userRepository.find(new ByUserIdCriteria(user.id));
		if (users.length === 0) {
			throw new UserNotFoundError(`User with id ${user.id.value} not found`);
		}

		const notSameId = new Filter(
			new FilterField('id'),
			new FilterOperator(FilterOperators.NOT_EQUAL),
			new FilterValue(user.id.value)
		);

		// Creating criteria that search user by username that are not removed
		const byUsernameCriteria = new ByUsernameCriteria(user.username);
		let criteria = new Criteria(
			[...byUsernameCriteria.filters, new NotRemovedFilter(), notSameId],
			byUsernameCriteria.order,
			byUsernameCriteria.limit,
			byUsernameCriteria.offset,
		);

		// Checking if user already exist
		let fetchedUsers = await injector.userRepository.find(criteria);
		if (fetchedUsers.length > 0) {
			throw new UserAlreadyExistsError(`User with username '${user.username.value}' already exists`);
		}

		// Creating criteria that search user by email that are not removed
		const byEmailCriteria = new ByEmailCriteria(user.email);
		criteria = new Criteria(
			[...byEmailCriteria.filters, new NotRemovedFilter(), notSameId],
			byUsernameCriteria.order,
			byUsernameCriteria.limit,
			byUsernameCriteria.offset,
		);

		// Checking if user already exist
		fetchedUsers = await injector.userRepository.find(criteria);
		if (fetchedUsers.length > 0) {
			throw new UserAlreadyExistsError(`User with email '${user.email.value}' already exists`);
		}

		user.withEncryptedPassword(await PasswordUtils.encrypt(user.password));
		return await injector.userRepository.update(user);
	}
}
