import { Injector } from "../../../shared/infrastructure/injector";
import { Criteria } from "../../../shared/domain/criteria/Criteria";
import { User } from "../domain/User";
import {NotRemovedFilter} from "../../../shared/domain/criteria/filter/common/NotRemovedFilter";

export class FindUsersAction {
	static async run(injector: Injector, criteria: Criteria): Promise<Array<User>> {
		const fullCriteria = new Criteria(
			[
				...criteria.filters,
				new NotRemovedFilter()
			],
			criteria.order,
			criteria.limit,
			criteria.offset
		)
		return await injector.userRepository.find(fullCriteria);
	}
}
