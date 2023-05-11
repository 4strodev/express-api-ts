export function parseBoolean(value: string) {
	if (value === "true") {
		return true;
	}
	if (value === "false") {
		return false;
	}

	throw new Error("Value must be 'true' or 'false'");
}
