import express from "express";

import { Task, TaskQuery, TaskId, UpdateTask } from "../schemas/task.schema.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  getTaskById,
  getTaskByQuery,
  createTask,
  modifyTask,
  deleteTask
} from "../controllers/task-controller.js";

//VALIDATOR
const taskQueryValidator = validate(TaskQuery, "query");
const taskValidator = validate(Task);
const taskUpdateValidator = validate(UpdateTask);
const idValidator = validate(TaskId, "params");



export default function createTaskRouter(taskService) {
  const router = express.Router();
  router.get("/:id", idValidator, getTaskById(taskService));
  router.get("/", taskQueryValidator, getTaskByQuery(taskService));
  router.post("/", taskValidator, createTask(taskService));
  router.put("/:id", idValidator, taskUpdateValidator, modifyTask(taskService));
  router.delete("/:id", idValidator, deleteTask(taskService));

  return router;
}