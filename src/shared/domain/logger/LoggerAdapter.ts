export enum LogLevel {
	INFO = "INFO",
	DEBUG = "DEBUG",
	WARN = "WARN",
	ERROR = "ERROR",
}

export interface LoggerAdapter {
	log(level: LogLevel, message: string): void;

	info(message: string): void;

	debug(message: string): void;

	warn(message: string): void;

	error(message: string): void;
}
