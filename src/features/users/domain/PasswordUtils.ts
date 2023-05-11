import bcrypt from "bcrypt";
import { Password } from "./value-objects/Password";
import { EncryptedPassword } from "./value-objects/EncryptedPassword";

export class PasswordUtils {
	/**
	 * Encrypt password
	 * @param password
	 */
	public static async encrypt(password: Password): Promise<EncryptedPassword> {
		const hash = await bcrypt.hash(password.value, 14);
		return new EncryptedPassword(hash);
	}

	/**
	 * Check if encrypted password and password are the same
	 * @param hash
	 * @param password
	 */
	public static async match(hash: EncryptedPassword, password: Password): Promise<boolean> {
		return await bcrypt.compare(password.value, hash.value);
	}
}
