import express from "express";

import { apiKeyMiddleware } from "./middlewares/api-key.middleware.js";
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware.js";
import { requestLoggerMiddleware } from "./middlewares/request-logger.middleware.js";

import createProjectRouter from "./routes/project.route.js";
import createTaskRouter from "./routes/task.route.js";

export default function createApp({ taskService, projectService }) {
  const app = express();

  //MIDDLEWARE
  app.use(requestLoggerMiddleware);
  app.use(apiKeyMiddleware);
  app.use(express.json());

  app.use("/projects", createProjectRouter(projectService));
  app.use("/tasks", createTaskRouter(taskService));
  app.get("/health", (_req, res) => {
    return res.status(200).json({ status: "ok" });
  });

  app.use(errorHandlerMiddleware);
  return app;
}
