import { Username } from "../../users/domain/value-objects/Username";
import { Password } from "../../users/domain/value-objects/Password";
import { Email } from "../../users/domain/value-objects/Email";
import { MissingCredentialsError } from "../domain/MissingCredentialsError";
import { Injector } from "../../../shared/infrastructure/injector";
import { ByUsernameCriteria } from "../../users/domain/criteria/ByUsernameCriteria";
import { UserNotFoundError } from "../../users/domain/error/UserNotFoundError";
import { PasswordUtils } from "../../users/domain/PasswordUtils";
import { PasswordNotEncryptedError } from "../../users/domain/error/PasswordNotEncryptedError";
import { PasswordNotMatchError } from "../../users/domain/error/PasswordNotMatchError";
import { User } from "../../users/domain/User";
import { ByEmailCriteria } from "../../users/domain/criteria/ByEmailCriteria";
import { UserIdNotDefinedError } from "../../users/domain/error/UserIdNotDefinedError";
import { AccessToken } from "../domain/AccessToken";
import { RefreshToken } from "../domain/RefreshToken";
import { UnexpectedError } from "../../../shared/domain/error/UnexpectedError";

export class LoginAction {
	static async run(
		injector: Injector,
		credentials: {
			username?: Username;
			email?: Email;
			password: Password;
		},
	): Promise<{ refreshToken: string; accessToken: string }> {
		const { username, email, password } = credentials;
		let user: User;
		if (!username && !email) {
			throw new MissingCredentialsError("Username or email must be passed");
		}

		if (username) {
			// Getting user by username
			const fetchedUsers = await injector.userRepository.find(new ByUsernameCriteria(username));
			user = fetchedUsers[0];
			if (!user) {
				throw new UserNotFoundError(`User with username ${username.value} not found`);
			}
		} else {
			// Getting user by email
			const fetchedUsers = await injector.userRepository.find(new ByEmailCriteria(email!));
			user = fetchedUsers[0];
			if (!user) {
				throw new UserNotFoundError(`User with username ${email!.value} not found`);
			}
		}

		if (!user.id) {
			throw new UserIdNotDefinedError();
		}
		if (!user.encryptedPassword) {
			throw new PasswordNotEncryptedError();
		}

		const passwordMatch = await PasswordUtils.match(user.encryptedPassword, password);
		if (!passwordMatch) {
			throw new PasswordNotMatchError();
		}

		// Creating tokens
		const accessToken = new AccessToken(user);
		const refreshToken = new RefreshToken(user);
		if (!refreshToken.expirationTime || !accessToken.expirationTime) {
			throw new UnexpectedError("Error creating tokens").withMetadata("Expiration time is not set");
		}

		const signedRefreshToken = await injector.jwtService.sign(refreshToken);
		const signedAccessToken = await injector.jwtService.sign(accessToken);

		// Saving refresh token
		await injector.authRepository.save(
			signedRefreshToken,
			user,
			new Date(refreshToken.expirationTime),
		);

		return { refreshToken: signedRefreshToken, accessToken: signedAccessToken };
	}
}
