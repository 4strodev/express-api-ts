import { Injector } from "../../../shared/infrastructure/injector";
import { ByUserIdCriteria } from "../../users/domain/criteria/ByUserIdCriteria";
import { Criteria } from "../../../shared/domain/criteria/Criteria";
import { NotRemovedFilter } from "../../../shared/domain/criteria/filter/common/NotRemovedFilter";
import { UserNotFoundError } from "../../users/domain/error/UserNotFoundError";
import { TokenTypes } from "../domain/value-objects/TokenType";
import { TokenNotValidError } from "../domain/errors/TokenNotValidError";
import { AccessToken } from "../domain/AccessToken";
import { ByEncodedTokenCriteria } from "../domain/criteria/ByEncodedTokenCriteria";
import { TokenRevokedError } from "../domain/errors/TokenRevokedError";

export class RefreshTokenAction {
	static async run(injector: Injector, jwt: string): Promise<string> {
		const token = await injector.jwtService.decode(jwt);
		console.log(token);
		if (token.tokenType.value !== TokenTypes.REFRESH) {
			throw new TokenNotValidError("Expected refresh token");
		}

		const fetchedTokens = await injector.authRepository.find(new ByEncodedTokenCriteria(jwt));
		if (!(fetchedTokens.length > 0)) {
			throw new TokenRevokedError();
		}

		// Checking user existence
		const userIdCriteria = new ByUserIdCriteria(token.userId);
		const fullCriteria = new Criteria(
			[...userIdCriteria.filters, new NotRemovedFilter()],
			userIdCriteria.order,
			userIdCriteria.limit,
			userIdCriteria.offset,
		);
		const fetchedUsers = await injector.userRepository.find(fullCriteria);
		const user = fetchedUsers[0];
		if (!user) {
			throw new UserNotFoundError(`User with id ${token.userId.value} not found`);
		}

		const accessToken = new AccessToken(user);
		return injector.jwtService.sign(accessToken);
	}
}
