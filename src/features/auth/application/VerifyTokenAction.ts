import { Injector } from "../../../shared/infrastructure/injector";
import { BadRequestError } from "../../../shared/domain/error/BadRequestError";
import { ByUserIdCriteria } from "../../users/domain/criteria/ByUserIdCriteria";
import { TokenType } from "../domain/value-objects/TokenType";
import { TokenNotValidError } from "../domain/errors/TokenNotValidError";
import { Token } from "../domain/Token";
import { AuthEventEmitter } from "../domain/events/AuthEventEmitter";

export class VerifyTokenAction {
	static async run(injector: Injector, jwt: string, desiredTokenType: TokenType) {
		let payload: Token;
		try {
			payload = await injector.jwtService.verify(jwt);
		} catch (err) {
			AuthEventEmitter.TokenNotValid.emit(jwt);
			throw new TokenNotValidError().withMetadata(err);
		}

		// Verifying token type
		if (desiredTokenType.value !== payload.tokenType.value) {
			throw new BadRequestError(`Token must be ${desiredTokenType} token`);
		}

		// Checking user existence
		const fetchedUsers = await injector.userRepository.find(new ByUserIdCriteria(payload.userId));
		const user = fetchedUsers[0];
		if (!user) {
			throw new BadRequestError(`User with id ${payload.userId.value} not found`);
		}

		// Checking user role
		if (payload.role.value !== user.userRole.value) {
			throw new BadRequestError("User role does not match with current user role");
		}
	}
}
