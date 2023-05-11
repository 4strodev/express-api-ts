import { UserId } from "./value-objects/UserId";
import { UserFirstname } from "./value-objects/UserFirstname";
import { UserLastname } from "./value-objects/UserLastname";
import { Email } from "./value-objects/Email";
import { Password } from "./value-objects/Password";
import { JsonSerializer } from "../../../shared/domain/JsonSerializer";
import { Username } from "./value-objects/Username";
import { EncryptedPassword } from "./value-objects/EncryptedPassword";
import { UserRole, UserRoles } from "./value-objects/UserRole";

export class User implements JsonSerializer {
	get userRole(): UserRole {
		return this._userRole;
	}
	get updatedAt(): Date {
		return this._updatedAt;
	}
	get createdAt(): Date {
		return this._createdAt;
	}
	get password(): Password {
		return this._password;
	}

	get email(): Email {
		return this._email;
	}

	get lastname(): UserLastname {
		return this._lastname;
	}

	get firstname(): UserFirstname {
		return this._firstname;
	}

	get id(): UserId | undefined {
		return this._id;
	}

	get username(): Username {
		return this._username;
	}

	get encryptedPassword(): EncryptedPassword | undefined {
		return this._encryptedPassword;
	}

	private _id?: UserId;
	private _username: Username;
	private _firstname: UserFirstname;
	private _lastname: UserLastname;
	private _email: Email;
	private _password: Password;
	private _userRole: UserRole;
	private _encryptedPassword?: EncryptedPassword;
	private _createdAt: Date;
	private _updatedAt: Date;

	constructor(
		username: Username,
		firstname: UserFirstname,
		lastname: UserLastname,
		email: Email,
		password: Password,
	) {
		this._username = username;
		this._firstname = firstname;
		this._lastname = lastname;
		this._email = email;
		this._password = password;
		this._userRole = new UserRole(UserRoles.ADMIN);

		const now = new Date();
		this._createdAt = now;
		this._updatedAt = now;
	}

	public withId(id: UserId): User {
		this._id = id;
		return this;
	}

	public withUsername(username: Username): User {
		this._username = username;
		return this;
	}

	public withFirstname(firstname: UserFirstname): User {
		this._firstname = firstname;
		return this;
	}

	public withLastname(lastname: UserLastname): User {
		this._lastname = lastname;
		return this;
	}

	public withEmail(email: Email): User {
		this._email = email;
		return this;
	}

	public withPassword(password: Password): User {
		this._password = password;
		return this;
	}

	public withCreationDate(date: Date): User {
		this._createdAt = date;
		return this;
	}

	public withUpdateDate(date: Date): User {
		this._updatedAt = date;
		return this;
	}

	public withEncryptedPassword(encryptedPassword: EncryptedPassword): User {
		this._encryptedPassword = encryptedPassword;
		return this;
	}

	public withUserRole(userRole: UserRole): User {
		this._userRole = userRole;
		return this;
	}

	serialize() {
		return {
			id: this._id?.value,
			username: this._username.value,
			firstname: this._firstname.value,
			lastname: this._lastname.value,
			email: this._email.value,
			created_at: this._createdAt.getTime(),
			updated_at: this._updatedAt.getTime(),
			role: this._userRole.value,
		};
	}
}
