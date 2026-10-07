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



export default function createTaskRouter(taskStore, projectStore) {
  const router = express.Router();
  router.get("/:id", idValidator, getTaskById(taskStore));
  router.get("/", taskQueryValidator, getTaskByQuery(taskStore, projectStore));
  router.post("/", taskValidator, createTask(taskStore, projectStore));
  router.put("/:id", idValidator, taskUpdateValidator, modifyTask(taskStore));
  router.delete("/:id", idValidator, deleteTask(taskStore));

  return router;
}