import express from "express";
import * as z from "zod";
import { performance } from "node:perf_hooks";
import { readFileSync } from "node:fs";
import TaskStore from "./task-store.js";

import { NotFoundError, ValidationError } from "./app-error.js";

const app = express();
const port = 3000;
const envContent = readFileSync("./.env", "utf8").trim().split("\n");
const envVar = new Map(envContent.map(v => v.split("=")));


const Task = z.object({
  title: z.string().trim().min(1).max(100),
  priority: z.literal(["low", "medium", "high"]).default("medium"),
  dueDate: z.coerce.date().refine(
    (date) => date > new Date(), { error: "Date must be in the future" }
  ).optional()
})

const TaskId = z.int().min(0);

function taskValidator(req, _res, next) {
  const result = Task.safeParse(req.body);
  if (!result.success) {
    const details = result.error.issues.map(i => ({ field: i.path.join("."), message: i.message }));
    throw new ValidationError(details, "invalidation id")
  }
  next();
}

function taskIdValidator(req, _res, next) {
  const id = Number(req.params["id"]);
  const result = TaskId.safeParse(id);
  if (!result.success) {
    const details = result.error.issues.map(i => ({ field: i.path.join("."), message: i.message }));
    throw new ValidationError(details, "invalidation id")
  }
  req.params["id"] = id;
  next();
}

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

const taskStore = await TaskStore.create("../data/task.json");

app.get("/tasks", (_req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  const tasks = taskStore.list();
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

app.get("/tasks/:id", taskIdValidator, (req, res) => {
  const id = req.params["id"];
  const task = taskStore.findTask(id);
  if (task === null) {
    throw new NotFoundError("Task not found");
  }
  res.writeHead(201, { "Content-Type": "application/json" });
  res.write(JSON.stringify(task));
  res.end();
})

app.post("/tasks", taskValidator, async (req, res) => {
  const task = req.body;
  await taskStore.add(task["title"], task["priority"], task["dueDate"]);
  return res.status(201).end();
})

app.put("/tasks/:id", taskIdValidator, async (req, res) => {
  const id = req.params["id"];
  const t = await taskStore.update(id, req.body);
  if (t==null) { return res.status(404).json({ error: "not found" }) }
  return res.status(200).json(JSON.stringify(t));
})

app.patch("/tasks/:id", taskIdValidator, async (req, res) => {
  const id = req.params["id"];
  const t = await taskStore.update(id, req.body);
  if (t==null) { return res.status(404).json({ error: "not found" })}
  return res.status(200).json(JSON.stringify(t));
})

app.delete("/tasks/:id", taskIdValidator, async (req, res) => {
  const id = req.params["id"];
  try {
    await taskStore.delete(id);
    res.status(204).end();
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
})

app.get("/health",(_req, res) => {
  return res.status(200).json({ status: "ok" });
})

app.use((err, _req, res, _next) => {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details 
      }
    });
})

app.listen(port, () => console.log(`server is listening on port ${port}`));