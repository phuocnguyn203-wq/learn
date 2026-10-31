import express from "express";

import {
  getTaskById,
  getTaskByQuery,
  createTask,
  modifyTask,
  deleteTask,
  move
} from "../controllers/task-controller.js";

import TaskService from "../services/task.service.js";

export default function createTaskRouter(taskService: TaskService) {
  const router = express.Router();
  router.get("/:id", getTaskById(taskService));
  router.get("/", getTaskByQuery(taskService));
  router.post("/", createTask(taskService));
  router.put("/:id", modifyTask(taskService));
  router.delete("/:id",  deleteTask(taskService));
  router.post("/:id/move", move(taskService));

  return router;
}