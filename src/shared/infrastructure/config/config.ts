import { config } from "dotenv";
import { ConfigVariables, variables } from "./config-variables-definition";
import { parseBoolean } from "../../domain/utils/type-utils";

if (process.env.NODE_ENV === "development") {
	config();
}

const configVariables: ConfigVariables = {
	DB_NAME: "",
	DB_HOST: "",
	DB_PASSWORD: "",
	DB_PORT: 0,
	DB_USER: "",
	PORT: 0,
	JWT_SECRET: "",
};

let parsed: boolean = false;

export function getConfig(): ConfigVariables {
	if (parsed) {
		return configVariables;
	}

	for (const variable of variables) {
		const envValue = process.env[variable.name];
		if (!envValue) {
			if (variable.required) {
				throw new Error(`Environment variable ${variable.name} is not defined and it is required`);
			}

			// rome-ignore lint: wee need to use explicit any. But is in a known situation
			(configVariables as any)[variable.name] = variable.default;
			continue;
		}
		if (variable.type === "number") {
			const parsedValue = parseFloat(envValue);
			if (!parsedValue) {
				throw new Error(`Environment variable ${variable.name} must be a number`);
			}

			// rome-ignore lint: wee need to use explicit any. But is in a known situation
			(configVariables as any)[variable.name] = parsedValue;
			continue;
		}
		if (variable.type === "integer") {
			const parsedValue = parseInt(envValue);
			if (!parsedValue) {
				throw new Error(`Environment variable ${variable.name} must be an integer`);
			}

			// rome-ignore lint: wee need to use explicit any. But is in a known situation
			(configVariables as any)[variable.name] = parsedValue;
		}
		if (variable.type === "boolean") {
			let parsedValue: boolean;
			try {
				parsedValue = parseBoolean(envValue);
			} catch (err) {
				throw new Error(`Env variable is not a valid boolean: ${err}`);
			}
			if (!parsedValue) {
				throw new Error(`Environment variable ${variable.name} must be an integer`);
			}
			// rome-ignore lint: wee need to use explicit any. But is in a known situation
			(configVariables as any)[variable.name] = parsedValue;
		}
		// rome-ignore lint: wee need to use explicit any. But is in a known situation
		(configVariables as any)[variable.name] = envValue;
	}

	parsed = true;
	return configVariables;
}
