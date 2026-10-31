import type { Request, Response } from "express";
import {
  TaskId,
  TaskQuery,
  Task,
  UpdateTask,
  TargetProjectId
} from "../schemas/task.schema.js";
import TaskService from "../services/task.service.js";
import parseOrThrow from "../middlewares/validate.middleware.js";

function getTaskById(taskService: TaskService) {
  return async (req: Request, res: Response) => {
    const { id } = parseOrThrow(TaskId, req.params, "params");
    res.status(200).json(await taskService.getById(id));
  };
}

function getTaskByQuery(taskService: TaskService) {
  return async (req: Request, res: Response) => {
    const query = parseOrThrow(TaskQuery, req.query, "query");
    res.status(200).json(await taskService.list(query));
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

function move(taskService: TaskService) {
  return async (req: Request, res: Response) => {
    const { id: taskId } = parseOrThrow(TaskId, req.params, "params")
    const { targetProjectId: projectId } = parseOrThrow(TargetProjectId, req.body, "body")
    const result = await taskService.move(taskId, projectId)
    res.status(200).json(result)
  }
}

export {
  getTaskById,
  getTaskByQuery,
  createTask,
  modifyTask,
  deleteTask,
  move
};
