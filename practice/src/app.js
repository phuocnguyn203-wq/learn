import express from "express";

import TaskStore from "./task-store.js";
import ProjectStore from "./project-store.js";

import { apiKeyMiddleware } from "./middlewares/api-key.middleware.js";
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware.js";
import { requestLoggerMiddleware } from "./middlewares/request-logger.middleware.js";

import createProjectRouter from "./routes/project.route.js";
import createTaskRouter from "./routes/task.route.js";

const app = express();

//MIDDLEWARE
app.use(requestLoggerMiddleware);
app.use(apiKeyMiddleware);
app.use(express.json());

// DATA
const taskStore = await TaskStore.create("../data/task.json");
const projectStore = await ProjectStore.create("../data/project.json");

const projectRouter = createProjectRouter(taskStore, projectStore);
const taskRouter = createTaskRouter(taskStore, projectStore);

app.use("/projects", projectRouter);
app.use("/tasks", taskRouter);
app.get("/health",(_req, res) => {
  return res.status(200).json({ status: "ok" });
})

app.use(errorHandlerMiddleware);
export default app;