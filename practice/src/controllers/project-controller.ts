import type { Request, Response } from "express";
import parseOrThrow from "../middlewares/validate.middleware.js";
import ProjectService from "../services/project.service.js";
import {
  Project,
  ProjectId,
  UpdateProject,
} from "../schemas/project.schema.js";
function getAllProject(projectService: ProjectService) {
  return (_req: Request, res: Response) => {
    res.status(200).json(projectService.list());
  };
}

function getProjectById(projectService: ProjectService) {
  return (req: Request, res: Response) => {
    const { id } = parseOrThrow(ProjectId, req.params, "params");
    res.status(200).json(projectService.getById(id));
  };
}

function createProject(projectService: ProjectService) {
  return async (req: Request, res: Response) => {
    const body = parseOrThrow(Project, req.body, "body");
    res.status(201).json(await projectService.create(body));
  };
}

function modifyProject(projectService: ProjectService) {
  return async (req: Request, res: Response) => {
    const { id } = parseOrThrow(ProjectId, req.params, "params");
    const body = parseOrThrow(UpdateProject, req.body, "body");
    res.status(200).json(await projectService.update(id, body));
  };
}

function deleteProject(projectService: ProjectService) {
  return async (req: Request, res: Response) => {
    const { id } = parseOrThrow(ProjectId, req.params, "params");
    await projectService.delete(id);
    res.status(204).end();
  };
}

export {
  getAllProject,
  getProjectById,
  createProject,
  modifyProject,
  deleteProject,
};
