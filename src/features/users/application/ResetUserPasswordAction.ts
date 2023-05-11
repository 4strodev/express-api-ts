import { Password } from "../domain/value-objects/Password";
import { User } from "../domain/User";
import { UpdateUserAction } from "./UpdateUserAction";
import { UserEventEmitter } from "../domain/events/UserEventEmitter";
import { Injector } from "../../../shared/infrastructure/injector";

export class ResetUserPasswordAction {
	/**
	 * Generates a random password for user and saves this changes in repository
	 * @param user
	 */
	static async run(injector: Injector, user: User) {
		user.withPassword(Password.random());

		const updatedUser = await UpdateUserAction.run(injector, user);

		UserEventEmitter.passwordReset.emit(updatedUser);
	}
}
