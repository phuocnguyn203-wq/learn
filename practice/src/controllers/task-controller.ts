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
    const actor = req.actor!
    res.status(200).json(await taskService.getById(id, actor));
  };
}

function getTaskByQuery(taskService: TaskService) {
  return async (req: Request, res: Response) => {
    const query = parseOrThrow(TaskQuery, req.query, "query");
    const actor = req.actor!
    res.status(200).json(await taskService.list(query, actor));
  };
}

function createTask(taskService: TaskService) {
  return async (req: Request, res: Response) => {
    const body = parseOrThrow(Task, req.body, "body")
    const actor = req.actor!
    res.status(201).json(await taskService.create(body, actor));
  };
}

function modifyTask(taskService: TaskService) {
  return async (req: Request, res: Response) => {
    const { id } = parseOrThrow(TaskId, req.params, "params");
    const body = parseOrThrow(UpdateTask, req.body, "body");
    const actor = req.actor!
    res.status(200).json(await taskService.update(id, body, actor));
  };
}

function deleteTask(taskService: TaskService) {
  return async (req: Request, res: Response) => {
    const { id } = parseOrThrow(TaskId, req.params, "params");
    const actor = req.actor!
    await taskService.delete(id, actor);
    res.status(204).end();
  };
}

function move(taskService: TaskService) {
  return async (req: Request, res: Response) => {
    const { id: taskId } = parseOrThrow(TaskId, req.params, "params")
    const { targetProjectId: projectId } = parseOrThrow(TargetProjectId, req.body, "body")
    const actor = req.actor!
    const result = await taskService.move(taskId, projectId, actor)
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
