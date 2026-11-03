import type { Request, Response } from "express";
import parseOrThrow from "../middlewares/validate.middleware.js";
import ProjectService from "../services/project.service.js";
import {
  AddOrRemoveMember,
  Project,
  ProjectId,
  UpdateProject,
} from "../schemas/project.schema.js";
function getAllProject(projectService: ProjectService) {
  return async (req: Request, res: Response) => {
    const actor = req.actor!
    res.status(200).json(await projectService.list(actor));
  };
}

function getProjectById(projectService: ProjectService) {
  return async (req: Request, res: Response) => {
    const { id } = parseOrThrow(ProjectId, req.params, "params");
    const actor = req.actor!
    res.status(200).json(await projectService.getById(id, actor));
  };
}

function createProject(projectService: ProjectService) {
  return async (req: Request, res: Response) => {
    const body = parseOrThrow(Project, req.body, "body");
    const actor = req.actor!
    res.status(201).json(await projectService.create(body, actor));
  };
}

function modifyProject(projectService: ProjectService) {
  return async (req: Request, res: Response) => {
    const { id } = parseOrThrow(ProjectId, req.params, "params");
    const body = parseOrThrow(UpdateProject, req.body, "body");
    const actor = req.actor!
    res.status(200).json(await projectService.update(id, body, actor));
  };
}

function deleteProject(projectService: ProjectService) {
  return async (req: Request, res: Response) => {
    const { id } = parseOrThrow(ProjectId, req.params, "params");
    const actor = req.actor!
    await projectService.delete(id, actor);
    res.status(204).end();
  };
}

function addMember(projectService: ProjectService) {
  return async (req: Request, res: Response) => {
    const { userId } = parseOrThrow(AddOrRemoveMember, req.body, "body")
    const { id: projectId } = parseOrThrow(ProjectId, req.params, "params")
    const actor = req.actor!
    await projectService.addMember(projectId, userId, actor)
    return res.status(204).end()
  }
}

function removeMember(projectService: ProjectService) {
  return async (req: Request, res: Response) => {
    const { userId } = parseOrThrow(AddOrRemoveMember, req.params, "params")
    const { id: projectId } = parseOrThrow(ProjectId, req.params, "params")
    const actor = req.actor!
    const result = await projectService.removeMember(projectId, userId, actor)
    return result ? res.status(204).end() : res.status(400).end()
  }
}

export {
  getAllProject,
  getProjectById,
  createProject,
  modifyProject,
  deleteProject,
  addMember,
  removeMember
};
