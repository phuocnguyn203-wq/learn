import express from "express";

import {
  getAllProject,
  getProjectById,
  createProject,
  modifyProject,
  deleteProject,
  addMember,
  removeMember,
} from "../controllers/project-controller.js";

import ProjectService from "../services/project.service.js";



//PROJECT ROUTE
export default function projectRouter(projectService: ProjectService) {
  const router = express.Router();
  router.get("/", getAllProject(projectService));
  router.get("/:id", getProjectById(projectService));
  router.post("/", createProject(projectService));
  router.put("/:id", modifyProject(projectService));
  router.delete("/:id", deleteProject(projectService));
  router.post("/:id/members", addMember(projectService));
  router.delete("/:id/members/:userId", removeMember(projectService))

  return router;
};