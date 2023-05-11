import { Criteria } from "../../../shared/domain/criteria/Criteria";
import { User } from "../../users/domain/User";
import { Token } from "./Token";

export interface AuthTokenRepository {
	save(jwt: string, user: User, expirationTime: Date): Promise<void>;

	delete(criteria: Criteria): Promise<void>;

	find(criteria: Criteria): Promise<Array<string>>;
}
