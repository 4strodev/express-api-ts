import { Token } from "../Token";

export interface JwtAdapter {
	/**
	 * Sign payload and set expiration as expiration time the provided timestamp
	 * @param payload
	 * @param expirationTime
	 */
	sign(payload: Token): Promise<string>;
	verify(jwt: string): Promise<Token>;
	decode(jwt: string): Promise<Token>;
}
