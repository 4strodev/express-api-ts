import { User } from "../domain/User";
import { Injector } from "../../../shared/infrastructure/injector";
import { PasswordUtils } from "../domain/PasswordUtils";
import { checkUserExistence } from "./utils/check-user-existence";
import {ByUsernameCriteria} from "../domain/criteria/ByUsernameCriteria";
import {Criteria} from "../../../shared/domain/criteria/Criteria";
import {NotRemovedFilter} from "../../../shared/domain/criteria/filter/common/NotRemovedFilter";
import {UserAlreadyExistsError} from "../domain/error/UserAlreadyExistsError";
import {ByEmailCriteria} from "../domain/criteria/ByEmailCriteria";

export class SaveUserAction {
	/**
	 * Saves user and return user with all data.
	 *
	 * For example, you pass a user, and it returns the same user but with corresponding id.
	 * @param user
	 */
	static async run(injector: Injector, user: User): Promise<User> {
		// Creating criteria that search user by username that are not removed
		const byUsernameCriteria = new ByUsernameCriteria(user.username);
		let criteria = new Criteria(
			[...byUsernameCriteria.filters, new NotRemovedFilter()],
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
			[...byEmailCriteria.filters, new NotRemovedFilter()],
			byUsernameCriteria.order,
			byUsernameCriteria.limit,
			byUsernameCriteria.offset,
		);

		// Checking if user already exist
		fetchedUsers = await injector.userRepository.find(criteria);
		if (fetchedUsers.length > 0) {
			throw new UserAlreadyExistsError(`User with email '${user.email.value}' already exists`);
		}

		// Saving user
		user.withEncryptedPassword(await PasswordUtils.encrypt(user.password));
		return await injector.userRepository.save(user);
	}
}
