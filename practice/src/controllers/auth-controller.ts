import type { Request, Response } from "express";
import { RegisterAuth, LoginAuth, RefreshAuth } from "../schemas/auth.schema.js";
import AuthService from "../services/auth.service.js";
import UserService from "../services/user.service.js";
import parseOrThrow from "../middlewares/validate.middleware.js";

function register(userService: UserService) {
  return async (req: Request, res: Response) => {
    const { email, name, password } = parseOrThrow(RegisterAuth, req.body, "body");
    res.status(201).json(await userService.create(email, name, password));
  };
}

function login(authService: AuthService) {
  return async (req: Request, res: Response) => {
    const { email, password } = parseOrThrow(LoginAuth, req.body, "body");
    res.status(200).json(await authService.login(email, password));
  };
}

function refresh(authService: AuthService) {
  return async (req: Request, res: Response) => {
    const { refreshToken } = parseOrThrow(RefreshAuth, req.body, "body");
    res.status(200).json(await authService.refresh(refreshToken));
  };
}

function logout(authService: AuthService) {
  return async (req: Request, res: Response) => {
    const { refreshToken } = parseOrThrow(RefreshAuth, req.body, "body");
    await authService.logout(refreshToken);
    res.status(204).end();
  };
}

// Chạy sau requireAuth nên req.userId luôn có
function me(userService: UserService) {
  return async (req: Request, res: Response) => {
    res.status(200).json(await userService.getById(req.userId!));
  };
}

export {
  register,
  login,
  refresh,
  logout,
  me
};
