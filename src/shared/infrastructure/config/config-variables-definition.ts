export interface EnvVariable {
	type: "string" | "integer" | "number" | "boolean";
	name: string;
	default: string | number | boolean;
	required: boolean;
}

export type EnvVariables = Array<EnvVariable>;

export const variables: EnvVariables = [
	{
		name: "DB_NAME",
		default: "prestashop",
		required: false,
		type: "string",
	},
	{
		name: "DB_HOST",
		default: "localhost",
		required: false,
		type: "string",
	},
	{
		name: "DB_PASSWORD",
		default: "1234",
		required: false,
		type: "string",
	},
	{
		name: "DB_PORT",
		default: 3306,
		required: false,
		type: "number",
	},
	{
		name: "DB_USER",
		default: "root",
		required: false,
		type: "string",
	},
	{
		name: "PORT",
		default: 3000,
		required: false,
		type: "number",
	},
	{
		name: "JWT_SECRET",
		default: 3000,
		required: true,
		type: "string",
	},
];

export interface ConfigVariables {
	PORT: number;
	DB_HOST: string;
	DB_USER: string;
	DB_PASSWORD: string;
	DB_PORT: number;
	DB_NAME: string;
	JWT_SECRET: string;
}
