import { AppError, ValidationError } from "../errors/app-error.js";
import { NextFunction, Request, Response } from "express";
import type { Details } from "../errors/app-error.js";
const errorHandlerMiddleware = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
		let returnError: {
			code: string;
			message: string;
			details?: Details[]
		} = {
			code: err.code,
			message: err.message,
		}
		if (err instanceof ValidationError) {
			returnError.details = err.details;
		}
		return res.status(err.statusCode).json(returnError);
	}else {
    console.log(err)
		return res.status(500).json({ error: "Internal Error" });
	}
}

export { errorHandlerMiddleware };