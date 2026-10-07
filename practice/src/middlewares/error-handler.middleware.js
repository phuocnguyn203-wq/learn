import { AppError } from "../app-error.js";
const errorHandlerMiddleware = (err, _req, res, _next) => {
  if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			error: {
				code: err.code,
				message: err.message,
				details: err.details 
			}
		});
	}else {
    console.log(err)
		return res.status(500).json({ error: "Internal Error" });
	}
}

export { errorHandlerMiddleware };