import { User } from "../domain/User";
import { Username } from "../domain/value-objects/Username";
import { UserFirstname } from "../domain/value-objects/UserFirstname";
import { UserLastname } from "../domain/value-objects/UserLastname";
import { Email } from "../domain/value-objects/Email";
import { Password } from "../domain/value-objects/Password";
import { SaveUserAction } from "./SaveUserAction";
import { FindUsersAction } from "./FindUsersAction";
import { Criteria } from "../../../shared/domain/criteria/Criteria";
import { NotRemovedFilter } from "../../../shared/domain/criteria/filter/common/NotRemovedFilter";
import { Order } from "../../../shared/domain/criteria/order/Order";
import { Limit } from "../../../shared/domain/criteria/Limit";
import { Injector } from "../../../shared/infrastructure/injector";

export class CreateDefaultUserAction {
	/**
	 * Creates a default user only if there are no users in database
	 */
	static async run(injector: Injector) {
		const defaultUser = new User(
			new Username("admin"),
			new UserFirstname("admin"),
			new UserLastname("admin"),
			new Email("admin@example.com"),
			Password.none(),
		);

		const fetchedUsers = await FindUsersAction.run(
			injector,
			new Criteria([new NotRemovedFilter()], Order.none(), new Limit(1)),
		);
		if (fetchedUsers.length > 0) {
			return;
		}

		await SaveUserAction.run(injector, defaultUser);
	}
}
