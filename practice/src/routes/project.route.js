import express from "express";

import {
  getAllProject,
  getProjectById,
  createProject,
  modifyProject,
  deleteProject
} from "../controllers/project-controller.js";

import { Project, UpdateProject, ProjectId } from "../schemas/project.schema.js";
import { validate } from "../middlewares/validate.middleware.js";

//VALIDATOR
const projectValidator = validate(Project);
const projectUpdateValidator = validate(UpdateProject);
const idValidator = validate(ProjectId, "params");


//PROJECT ROUTE
export default function projectRouter(projectService) {
  const router = express.Router();
  router.get("/", getAllProject(projectService));
  router.get("/:id", idValidator, getProjectById(projectService));
  router.post("/", projectValidator, createProject(projectService));
  router.put("/:id", idValidator, projectUpdateValidator, modifyProject(projectService));
  router.delete("/:id", idValidator, deleteProject(projectService));

  return router;
};