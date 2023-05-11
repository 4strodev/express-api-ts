import { InvalidArgumentError } from "../../domain/error/InvalidArgumentError";

export interface Pagination {
	total_items: number;
	filtered_items: number;
}

export class HttpResponse<T> {
	public readonly success: boolean;
	public readonly data: T;
	public readonly msg: string;
	public readonly error_code?: string;
	public readonly pagination?: Pagination;

	constructor(payload: {
		success: boolean;
		data: T;
		msg: string;
		error_code?: string;
		pagination?: Pagination;
	}) {
		const { success, error_code, data, msg, pagination } = payload;
		if (!success && !error_code) {
			throw new InvalidArgumentError(
				"Error code must be defined when it's not a successful response",
			);
		}

		this.success = success;
		this.error_code = error_code;
		this.data = data;
		this.pagination = pagination;
		this.msg = msg;
	}

	public static success<T>(msg: string, data: T): HttpResponse<T> {
		return new HttpResponse<T>({ success: true, data, msg });
	}
}
