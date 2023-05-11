import { AuthTokenRepository } from "../domain/AuthTokenRepository";
import { Criteria } from "../../../shared/domain/criteria/Criteria";
import { BadRequestError } from "../../../shared/domain/error/BadRequestError";
import mysql from "mysql2/promise";
import { InfrastructureError } from "../../../shared/domain/error/InfrastructureError";
import { convertCriteriaToSql } from "../../../shared/infrastructure/mysql/criteria-utils";
import { User } from "../../users/domain/User";
import { UserIdNotDefinedError } from "../../users/domain/error/UserIdNotDefinedError";

export class MysqlAuthTokenRepository implements AuthTokenRepository {
	constructor(private pool: mysql.Pool) {}

	async delete(criteria: Criteria): Promise<void> {
		if (!criteria.hasFilters()) {
			throw new BadRequestError("Criteria must have filters to remove tokens");
		}
		const [sqlCriteria, parameters] = convertCriteriaToSql(criteria);

		try {
			await this.pool.query<mysql.OkPacket>(
				`DELETE
				 FROM tokens ${sqlCriteria}`,
				parameters,
			);
		} catch (err) {
			throw new InfrastructureError("Error removing tokens from database").withMetadata(err);
		}
	}

	async find(criteria: Criteria): Promise<Array<string>> {
		const [sqlCriteria, parameters] = convertCriteriaToSql(criteria);
		let rows: Array<mysql.RowDataPacket>;
		const tokens: Array<string> = [];

		try {
			const response = await this.pool.query<Array<mysql.RowDataPacket>>(
				`SELECT token
				 FROM tokens ${sqlCriteria}`,
				parameters,
			);
			rows = response[0];
		} catch (err) {
			throw new InfrastructureError("Error getting tokens").withMetadata(err);
		}

		for (const row of rows) {
			tokens.push(row.token);
		}

		return tokens;
	}

	async save(jwt: string, user: User, expirationTime: Date): Promise<void> {
		if (!user.id) {
			throw new UserIdNotDefinedError();
		}
		try {
			await this.pool.query<mysql.OkPacket>(
				`INSERT INTO tokens (token, user_id, expiration_date)
				 VALUES (?, ?, ?)`,
				[jwt, user.id.value, expirationTime],
			);
		} catch (err) {
			throw new InfrastructureError("Error saving token").withMetadata(err);
		}
	}
}
