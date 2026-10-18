import { ValidationError } from "../errors/app-error.js";
import * as z from "zod";

type Source = "body" | "query" | "params";


export default function parseOrThrow<S extends z.ZodType>(schema: S, data: unknown, source: Source): z.infer<S> {
	const result = schema.safeParse(data);
	if (!result.success) {
		const details = result.error.issues.map(i => ({ field: i.path.join("."), message: i.message }));
		throw new ValidationError(details, `invalid ${source}`);
	}

	return result.data;
}
