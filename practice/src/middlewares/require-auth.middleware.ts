import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { UnauthorizedError } from "../errors/app-error.js"
export default function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith("Bearer ")) {
    throw new UnauthorizedError("Unauthorized")
  }
  const token = auth.slice("Bearer ".length)
  const jwtKey = process.env.JWT_SECRET
  if (!jwtKey) {
    throw new Error("JWT_SECRET is not set")
  }
  try {
    const payload = jwt.verify(token, jwtKey) as jwt.JwtPayload
    req.userId = Number(payload.sub)
  } catch {
    throw new UnauthorizedError("Unauthorized")
  }

  next()
}