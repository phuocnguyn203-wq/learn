import type { Request, Response } from "express";
import {
  TaskId,
  TaskQuery,
  Task,
  UpdateTask,
} from "../schemas/task.schema.js";
import TaskService from "../services/task.service.js";
import parseOrThrow from "../middlewares/validate.middleware.js";

function getTaskById(taskService: TaskService) {
  return (req: Request, res: Response) => {
    const { id } = parseOrThrow(TaskId, req.params, "params");
    res.status(200).json(taskService.getById(id));
  };
}

function getTaskByQuery(taskService: TaskService) {
  return (req: Request, res: Response) => {
    const query = parseOrThrow(TaskQuery, req.query, "query");
    res.status(200).json(taskService.list(query));
  };
}

function createTask(taskService: TaskService) {
  return async (req: Request, res: Response) => {
    const body = parseOrThrow(Task, req.body, "body");
    res.status(201).json(await taskService.create(body));
  };
}

function modifyTask(taskService: TaskService) {
  return async (req: Request, res: Response) => {
    const { id } = parseOrThrow(TaskId, req.params, "params");
    const body = parseOrThrow(UpdateTask, req.body, "body");
    res.status(200).json(await taskService.update(id, body));
  };
}

function deleteTask(taskService: TaskService) {
  return async (req: Request, res: Response) => {
    const { id } = parseOrThrow(TaskId, req.params, "params");
    await taskService.delete(id);
    res.status(204).end();
  };
}

export {
  getTaskById,
  getTaskByQuery,
  createTask,
  modifyTask,
  deleteTask,
};
