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
export default function projectRouter(taskStore, projectStore) {
  const router = express.Router();
  router.get("/", getAllProject(projectStore));
  router.get("/:id", idValidator, getProjectById(projectStore));
  router.post("/", projectValidator, createProject(projectStore));
  router.put("/:id", idValidator, projectUpdateValidator, modifyProject(projectStore));
  router.delete("/:id", idValidator, deleteProject(projectStore));

  return router;
};