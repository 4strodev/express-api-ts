import { Criteria } from "../../../../shared/domain/criteria/Criteria";
import { User } from "../User";

export interface UserRepository {
	/**
	 * Find users by specified criteria
	 * @param criteria
	 */
	find(criteria: Criteria): Promise<Array<User>>;

	/**
	 * Save provided user to repository
	 * @param user
	 */
	save(user: User): Promise<User>;

	/**
	 * Update provided user
	 * @param user
	 */
	update(user: User): Promise<User>;
	remove(criteria: Criteria): Promise<void>;
}
