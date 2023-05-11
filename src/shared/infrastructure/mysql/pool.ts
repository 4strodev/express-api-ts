import mysql from "mysql2/promise";
import { getConfig } from "../config/config";

const config = getConfig();

export const mysqlPool = mysql.createPool({
	port: config.DB_PORT,
	user: config.DB_USER,
	host: config.DB_HOST,
	database: config.DB_NAME,
	password: config.DB_PASSWORD,
});
