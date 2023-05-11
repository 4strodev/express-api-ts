import { LoggerAdapter, LogLevel } from "../../domain/logger/LoggerAdapter";
import winston from "winston";

export class WinstonLogger implements LoggerAdapter {
	private readonly logger = winston.createLogger({
		level: "info",
		format: winston.format.json(),
		defaultMeta: { service: "backoffice API" },
		transports: [
			new winston.transports.Console({
				format: winston.format.simple(),
			}),
		],
	});

	debug(message: string): void {
		this.logger.debug(message);
	}

	error(message: string): void {
		this.logger.error(message);
	}

	log(level: LogLevel, message: string): void {
		this.logger.log({ level: level, message });
	}

	warn(message: string): void {
		this.logger.warn(message);
	}

	info(message: string): void {
		this.logger.info(message);
	}
}
