import { ValidationError } from "../errors/app-error.js";

export const validate = (schema, source = "body") => (req, res, next) => {
	const result = schema.safeParse(req[source]);
	if (!result.success) {
		const details = result.error.issues.map(i => ({ field: i.path.join("."), message: i.message }));
		throw new ValidationError(details, "invalid body");
	}
	req.validated ??= {};
	req.validated[source] = result.data;
	next();
}
