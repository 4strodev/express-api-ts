import { LoggerAdapter } from "../domain/logger/LoggerAdapter";
import { WinstonLogger } from "./logger/WinstonLogger";
import { UserRepository } from "../../features/users/domain/repositories/UserRepository";
import { MysqlUserRepository } from "../../features/users/infrastructure/MysqlUserRepository";
import { mysqlPool } from "./mysql/pool";
import { JwtAdapter } from "../../features/auth/domain/adapters/JwtAdapter";
import { JoseJwt } from "../../features/auth/infrastructure/JoseJwt";
import { getConfig } from "./config/config";
import { MysqlAuthTokenRepository } from "../../features/auth/infrastructure/MysqlAuthTokenRepository";
import { AuthTokenRepository } from "../../features/auth/domain/AuthTokenRepository";

export interface Injector {
	logger: LoggerAdapter;
	userRepository: UserRepository;
	authRepository: AuthTokenRepository;
	jwtService: JwtAdapter;
}

export const injector: Injector = {
	logger: new WinstonLogger(),
	userRepository: new MysqlUserRepository(mysqlPool),
	authRepository: new MysqlAuthTokenRepository(mysqlPool),
	jwtService: new JoseJwt(getConfig().JWT_SECRET),
};
