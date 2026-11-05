import {
  register,
  login,
  refresh,
  logout,
  me
} from "../controllers/auth-controller.js"

import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import AuthService from "../services/auth.service.js";
import UserService from "../services/user.service.js";
import requireAuth from "../middlewares/require-auth.middleware.js";
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5
});
export default function createAuthRouter(authService: AuthService, userService: UserService) {
  const router = Router()
  router.post("/register", register(userService))
  router.post("/login", loginLimiter, login(authService))
  router.post("/refresh", refresh(authService))
  router.post("/logout", logout(authService))
  router.get("/me", requireAuth, me(userService))

  return router
}