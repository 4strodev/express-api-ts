import { Injector, injector } from "../../../shared/infrastructure/injector";
import { ByEncodedTokenCriteria } from "../domain/criteria/ByEncodedTokenCriteria";
import { TokenNotValidError } from "../domain/errors/TokenNotValidError";

export class LogoutAction {
	static async run(injector: Injector, jwt: string) {
		try {
			await injector.jwtService.decode(jwt);
		} catch (err) {
			throw new TokenNotValidError().withMetadata(err);
		}

		await injector.authRepository.delete(new ByEncodedTokenCriteria(jwt));
	}
}
