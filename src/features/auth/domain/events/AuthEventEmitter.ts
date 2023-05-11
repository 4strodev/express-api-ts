import { EventSubject } from "../../../../shared/domain/events/EventSubject";

export class AuthEventEmitter {
	static readonly TokenNotValid = new EventSubject<string>();
}
