import express from "express";

import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware.js";
import { requestLoggerMiddleware } from "./middlewares/request-logger.middleware.js";
import requireAuth from "./middlewares/require-auth.middleware.js";

import createProjectRouter from "./routes/project.route.js";
import createTaskRouter from "./routes/task.route.js";
import createAuthRouter from "./routes/auth.route.js";
import TaskService from "./services/task.service.js";
import ProjectService from "./services/project.service.js";
import UserService from "./services/user.service.js";
import AuthService from "./services/auth.service.js";

export default function createApp(
  { taskService, projectService, userService, authService }: {
    taskService: TaskService, projectService: ProjectService,
    userService: UserService, authService: AuthService
  }
) {
  const app = express();

  //MIDDLEWARE
  app.use(requestLoggerMiddleware);
  app.use(express.json());

  // /auth không cần đăng nhập (trừ /me, đã gắn requireAuth trong router)
  app.use("/auth", createAuthRouter(authService, userService));
  app.use("/projects", requireAuth, createProjectRouter(projectService));
  app.use("/tasks", requireAuth, createTaskRouter(taskService));
  app.get("/health", (_req, res) => {
    return res.status(200).json({ status: "ok" });
  });

  app.use(errorHandlerMiddleware);
  return app;
}
