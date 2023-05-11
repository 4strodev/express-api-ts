export interface ValueValid<T> {
	value: T;
	valid: boolean;
}

export interface ValueExpected<T> {
	value: T;
	expected: T;
}
