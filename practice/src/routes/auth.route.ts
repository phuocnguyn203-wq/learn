import {
  register,
  login,
  refresh,
  logout,
  me
} from "../controllers/auth-controller.js"
import AuthService from "../services/auth.service.js";
import { Router } from "express";
import UserService from "../services/user.service.js";
import requireAuth from "../middlewares/require-auth.middleware.js";
export default function createAuthRouter(authService: AuthService, userService: UserService) {
  const router = Router()
  router.post("/register", register(userService))
  router.post("/login", login(authService))
  router.post("/refresh", refresh(authService))
  router.post("/logout", logout(authService))
  router.get("/me", requireAuth, me(userService))

  return router
}