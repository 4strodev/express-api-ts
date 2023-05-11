import { from, Subject, Subscription, switchMap } from "rxjs";
import { eventErrorHandler } from "./event-error-handler";

export class EventSubject<T> {
	private subject: Subject<T> = new Subject<T>();
	constructor() {}

	emit(payload: T) {
		this.subject.next(payload);
	}

	listen(asyncHandler: (payload: T) => Promise<void>): Subscription {
		return this.subject
			.pipe(
				switchMap((payload) => {
					return from(asyncHandler(payload));
				}),
			)
			.subscribe({ error: eventErrorHandler });
	}
}
