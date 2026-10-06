import express from "express";
import * as z from "zod";
import { performance } from "node:perf_hooks";
import { readFileSync } from "node:fs";
import TaskStore from "./task-store.js";
import ProjectStore from "./project-store.js";
import { NotFoundError, ValidationError, AppError } from "./app-error.js";

const app = express();
const port = 3000;
const envContent = readFileSync("./.env", "utf8").trim().split("\n");
const envVar = new Map(envContent.map(v => v.split("=")));

function mapValidationResultToDetails(result) {
  return result.error.issues.map(i => ({ field: i.path.join("."), message: i.message }));
}

/* 
Task Query Validatio
*/
const TaskQuery = z.object({
  status: z.literal(["in_progress", "done"]).optional(),
  sort: z.literal(["createdAt", "-createdAt", "dueDate", "-dueDate"]).default("-createdAt"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

function taskQueryValidator(req, _res, next) {
  const result = TaskQuery.safeParse(req.query);
  if (!result.success) {
    const details = mapValidationResultToDetails(result);
    throw new ValidationError(details, "not valid query");
  }
  req.validatedQuery = result.data;
  next();
}

/*
Project Validator
*/
const Project = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1),
})

function projectValidator(req, _res, next) {
  const result = Project.safeParse(req.body);
  if (!result.success) {
    const details = mapValidationResultToDetails(result);
    throw new ValidationError(details, "invalid project");
  }
  next();
}

/*
Update Project Validtor
*/

const UpdateProject = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().min(1).optional(),
})

function projectUpdateValidator(req, _res, next) {
  const result = UpdateProject.safeParse(req.body);
  if (!result.success) {
    const details = mapValidationResultToDetails(result);
    throw new ValidationError(details, "invalid project");
  }
  next();
}

/*
Task Validtor
*/

const Task = z.object({
  title: z.string().trim().min(1).max(100),
  priority: z.literal(["low", "medium", "high"]).default("medium"),
  dueDate: z.coerce.date().refine(
    (date) => date > new Date(), { error: "Date must be in the future" }
  ).optional()
})

function taskValidator(req, _res, next) {
  const result = Task.safeParse(req.body);
  if (!result.success) {
    const details = result.error.issues.map(i => ({ field: i.path.join("."), message: i.message }));
    throw new ValidationError(details, "invalid task")
  }
  next();
}

/*
Task Id Validtor
*/
const TaskId = z.coerce.number().int().min(0);

function idValidator(req, _res, next) {
  const result = TaskId.safeParse(req.params["id"]);
  if (!result.success) {
    const details = result.error.issues.map(i => ({ field: i.path.join("."), message: i.message }));
    throw new ValidationError(details, "invalidation id")
  }
  req.params["id"] = Number(req.params["id"]);
  next();
}

/*
middleware
*/

app.use((req, res, next) => {
  const method = req.method;
  const path = req.path;
  const startInMs = performance.now();
  res.on("finish", () => {
    const timeElapsedInMs = performance.now() - startInMs
    console.log(`${method} ${path} ${res.statusCode} ${timeElapsedInMs.toFixed(2)} (ms)`);
  })
  next();
})
app.use((req, res, next) => {
  if (req.path === "/health") { return next(); }
  const userKey = req.get("x-api-key");
  if (!userKey || envVar.get("API_KEY") !== userKey) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
})
app.use(express.json());
/* -------------------------------------- */

const taskStore = await TaskStore.create("../data/task.json");
const projectStore = await ProjectStore.create("../data/project.json");

/* 
PROJECT ROUTE
*/

app.get("/projects", (_req, res) => {
  const projects = projectStore.fetchAllProjects();
  res.writeHead(200, { "Content-Type": "application/json"});
  res.write("[");
  let first = true;
  for (const p of projects) {
    if (first) {
    } else {
      res.write(",");
      first = false;
    }
    res.write(JSON.stringify(p));
  }
  res.end("]");
})

app.get("projects/:id", idValidator, (req, res) => {
  const p = projectStore.fetchProjectById(req.params["id"]);
  if (p == null) { throw new NotFoundError("project not found"); }
  return res.status(200).json(JSON.stringify(p));
})

app.post("/projects", projectValidator, async (req, res) => {
  const project = req.body;
  const p = await projectStore.createProject(
    project["name"],
    project["description"],
  )
  return res.status(200).json(JSON.stringify(p));
})

app.put("/projects/:id", idValidator, projectUpdateValidator, async (req, res) => {
  const result = await projectStore.updateProject(req.params["id"], req.body);
  if (result == null) { throw new NotFoundError("project not found"); }
  return res.status(200).json(JSON.stringify(result));
})

app.delete("/projects/:id", idValidator, async (req, res) => {
  const result = await projectStore.deleteProject(req.params["id"]);
  if (result == false) { throw new NotFoundError("project not found"); }
  return res.status(204).end();
})

/*
TASK ROUTES
*/

app.get("/projects/tasks", (_req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  const tasks = taskStore.fetchAllTask();
  res.write("[");
  let first = true;
  for (const task of tasks) {
    if (!first) {
      res.write(",");
    } else {
      first = false;
    }
    res.write(JSON.stringify(task));
  }
  res.end("]");
})

app.get("/projects/tasks/:id", idValidator, (req, res) => {
  const id = req.params["id"];
  const task = taskStore.fetchTaskById(id);
  if (task === null) {
    throw new NotFoundError("Task not found");
  }
  res.writeHead(201, { "Content-Type": "application/json" });
  res.write(JSON.stringify(task));
  res.end();
})

app.get("/projects/:id/tasks", idValidator, taskQueryValidator, (req, res) => {
  const projectId = req.params["id"];
  if (!projectStore.checkIdExist(projectId)) {
    throw new NotFoundError("project not found");
  }
  
  const taskQuery = req.validatedQuery;
  const { tasks, total, totalPage } = taskStore.fetchTaskByQuery(
    projectId,
    taskQuery["status"],
    taskQuery["sort"],
    taskQuery["page"],
    taskQuery["limit"],
  );
  const result = {
    data: tasks,
    meta: {
      page: taskQuery["page"], 
      limit: taskQuery["limit"],
      total,
      totalPage,
    }
  }
  return res.status(200).json(result);
})

app.post("/projects/:id/tasks", idValidator, taskValidator, async (req, res) => {
  const projectId = req.params["id"];
  if (!projectStore.checkIdExist(projectId)) {
    throw new NotFoundError("project not found");
  }
  const t = req.body;
  await taskStore.add(projectId, t["title"], t["priority"], t["dueDate"]);
  return res.status(201).end();
})

app.put("/projects/tasks/:id", idValidator, async (req, res) => {
  const id = req.params["id"];
  const t = await taskStore.update(id, req.body);
  if (t==null) { throw new NotFoundError("not found"); }
  return res.status(200).json(JSON.stringify(t));
})

app.patch("/projects/tasks/:id", idValidator, async (req, res) => {
  const id = req.params["id"];
  const t = await taskStore.update(id, req.body);
  if (t==null) { throw new NotFoundError("not found"); }
  return res.status(200).json(JSON.stringify(t));
})

app.delete("/projects/tasks/:id", idValidator, async (req, res) => {
  const id = req.params["id"];
  isDeleted = await projectStore.delete(id);
  res.status(204).end();
  
  if (!isDeleted) { throw new NotFoundError("not found"); }
})

app.get("/health",(_req, res) => {
  return res.status(200).json({ status: "ok" });
})

app.use((err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details 
      }
    });
  } else {
    return res.status(500).json({ error: "Internal Error" });
  }
})

app.listen(port, () => console.log(`server is listening on port ${port}`));
