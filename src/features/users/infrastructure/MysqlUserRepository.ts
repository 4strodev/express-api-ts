import { UserRepository } from "../domain/repositories/UserRepository";
import { Criteria } from "../../../shared/domain/criteria/Criteria";
import { User } from "../domain/User";
import mysql from "mysql2/promise";
import { convertCriteriaToSql } from "../../../shared/infrastructure/mysql/criteria-utils";
import { InfrastructureError } from "../../../shared/domain/error/InfrastructureError";
import { Username } from "../domain/value-objects/Username";
import { UserFirstname } from "../domain/value-objects/UserFirstname";
import { UserLastname } from "../domain/value-objects/UserLastname";
import { Email } from "../domain/value-objects/Email";
import { Password } from "../domain/value-objects/Password";
import { UserId } from "../domain/value-objects/UserId";
import { ByUserIdCriteria } from "../domain/criteria/ByUserIdCriteria";
import { UnexpectedError } from "../../../shared/domain/error/UnexpectedError";
import { EncryptedPassword } from "../domain/value-objects/EncryptedPassword";
import { PasswordNotEncryptedError } from "../domain/error/PasswordNotEncryptedError";
import { UserRole } from "../domain/value-objects/UserRole";
import { InvalidArgumentError } from "../../../shared/domain/error/InvalidArgumentError";
import { UserIdNotDefinedError } from "../domain/error/UserIdNotDefinedError";

export class MysqlUserRepository implements UserRepository {
	constructor(private pool: mysql.Pool) {}

	async find(criteria: Criteria): Promise<Array<User>> {
		const [sqlCriteria, parameters] = convertCriteriaToSql(criteria);
		let rows: Array<mysql.RowDataPacket>;
		const users: Array<User> = [];
		try {
			const response = await this.pool.query<Array<mysql.RowDataPacket>>(
				`SELECT id,
						username,
						firstname,
						lastname,
						email,
						password,
						created_at,
						updated_at,
						role
				 FROM users ${sqlCriteria}`,
				parameters,
			);
			rows = response[0];
		} catch (error) {
			throw new InfrastructureError("Error getting users from database").withMetadata(error);
		}

		try {
			for (const row of rows) {
				const user = new User(
					new Username(row.username),
					new UserFirstname(row.firstname),
					new UserLastname(row.lastname),
					new Email(row.email),
					Password.none(),
				)
					.withId(new UserId(row.id))
					.withCreationDate(row.created_at)
					.withUpdateDate(row.updated_at)
					.withEncryptedPassword(new EncryptedPassword(row.password))
					.withUserRole(UserRole.fromValue(row.role));

				users.push(user);
			}
		} catch (error) {
			throw new InfrastructureError("Error converting users to domain object").withMetadata(error);
		}

		return users;
	}

	async save(user: User): Promise<User> {
		if (!user.encryptedPassword) {
			throw new PasswordNotEncryptedError();
		}
		let rows: mysql.OkPacket;
		let insertId: number;
		try {
			const response = await this.pool.query<mysql.OkPacket>(
				`INSERT INTO users
				 (username,
				  firstname,
				  lastname,
				  email,
				  password,
				  role)
				 VALUES (?, ?, ?, ?, ?, ?)`,
				[
					user.username.value,
					user.firstname.value,
					user.lastname.value,
					user.email.value,
					user.encryptedPassword.value,
					user.userRole.value,
				],
			);

			rows = response[0];
			insertId = rows.insertId;
		} catch (err) {
			throw new InfrastructureError("Error saving user to database").withMetadata(err);
		}

		const savedUser = (await this.find(new ByUserIdCriteria(new UserId(insertId))))[0];
		if (!savedUser) {
			throw new UnexpectedError("Cannot get from database saved user");
		}

		return savedUser;
	}

	async update(user: User): Promise<User> {
		if (!user.id) {
			throw new UserIdNotDefinedError();
		}

		if (!user.encryptedPassword) {
			throw new InvalidArgumentError("User must have encrypted password");
		}

		try {
			await this.pool.query<mysql.OkPacket>(
				`UPDATE users
				 SET username  = ?,
					 firstname = ?,
					 lastname  = ?,
					 email     = ?,
					 password  = ?,
					 role      = ?
				 WHERE id = ?`,
				[
					user.username.value,
					user.firstname.value,
					user.lastname.value,
					user.email.value,
					user.encryptedPassword.value,
					user.userRole.value,
					user.id.value,
				],
			);
		} catch (err) {
			throw new InfrastructureError("Error updating user");
		}

		const users = await this.find(new ByUserIdCriteria(user.id));
		const updatedUser = users[0];
		if (!updatedUser) {
			throw new UnexpectedError("Cannot fetch updated user");
		}

		return updatedUser;
	}

	async remove(criteria: Criteria): Promise<void> {
		const [sqlCriteria, parameters] = convertCriteriaToSql(criteria);
		try {
			await this.pool.query<mysql.OkPacket>(
				`UPDATE users SET removed = true ${sqlCriteria}`,
				parameters,
			);
		} catch (err) {
			throw new InfrastructureError("Error removing users").withMetadata(err);
		}
	}
}
