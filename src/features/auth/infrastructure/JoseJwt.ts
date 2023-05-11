import { JwtAdapter } from "../domain/adapters/JwtAdapter";
import * as jose from "jose";
import { JWTPayload } from "jose";
import { Token } from "../domain/Token";
import { jwtSchema } from "../domain/verification-schemas/jwt-schema";
import { TokenNotValidError } from "../domain/errors/TokenNotValidError";

export class JoseJwt implements JwtAdapter {
	private readonly secret: Uint8Array;
	private algorithm: string;

	constructor(secret: string, algorithm: string = "HS256") {
		this.secret = new TextEncoder().encode(secret);
		this.algorithm = algorithm;
	}

	async sign(payload: Token): Promise<string> {
		const jwt = new jose.SignJWT(payload.serialize() as JWTPayload)
			.setProtectedHeader({ alg: this.algorithm })
			.setIssuedAt();

		if (payload.expirationTime) {
			jwt.setExpirationTime(payload.expirationTime);
		}

		return await jwt.sign(this.secret);
	}

	async verify(jwt: string): Promise<Token> {
		const { payload } = await jose.jwtVerify(jwt, this.secret);
		return Token.fromObject(payload);
	}

	async decode(jwt: string): Promise<Token> {
		const payload = await jose.decodeJwt(jwt);
		const result = jwtSchema.validate(payload);
		if (result.error) {
			throw new TokenNotValidError(result.error.message);
		}
		return Token.fromObject(payload);
	}
}
