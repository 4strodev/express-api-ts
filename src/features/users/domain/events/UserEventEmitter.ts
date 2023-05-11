import { EventSubject } from "../../../../shared/domain/events/EventSubject";
import { User } from "../User";

export class UserEventEmitter {
	static readonly passwordReset = new EventSubject<User>();
}
