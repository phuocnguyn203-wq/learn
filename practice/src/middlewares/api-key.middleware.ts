import type { Response, Request, NextFunction } from "express";
const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.path === "/health") { return next(); }
  const userKey = req.get("x-api-key");
  if (!userKey || process.env.API_KEY !== userKey) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

export { apiKeyMiddleware };
