import express from "express";
import { performance } from "node:perf_hooks";
import { readFileSync } from "node:fs";
import TaskStore from "./task-store.js";


const app = express();
const port = 3000;
const envContent = readFileSync("./.env", "utf8").trim().split("\n");
const envVar = new Map(envContent.map(v => v.split("=")));

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

app.get("/tasks", (req, res) => {
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

app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params["id"]);
  const task = taskStore.findTask(id);
  res.writeHead(201, { "Content-Type": "application/json" });
  res.write(JSON.stringify(task));
  res.end();
})

app.post("/tasks", async (req, res) => {
  const task = req.body;
  await taskStore.add(task["title"]);
  return res.status(201).end();
})

app.put("/tasks/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (! Number.isInteger(id) || ! (id > 0)) {
    return res.status(400).json({ error: "id must be positive integer" });
  }
  const t = await taskStore.update(id, req.body);
  if (t==null) { return res.status(404).json({ error: "not found" }) }
  return res.status(200).json(JSON.stringify(t));
})

app.patch("/tasks/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (! Number.isInteger(id) || !(id > 0)) {
    return res.status(400).json({ error: "id must be positive integer" });
  }
  const t = await taskStore.update(id, req.body);
  if (t==null) { return res.status(404).json({ error: "not found" })}
  return res.status(200).json(JSON.stringify(t));
})

app.delete("/tasks/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  if (! Number.isInteger(id) || !(id > 0)) {
    return res.status(400).json({ error: "id must be positive integer" });
  }
  try {
    await taskStore.delete(id);
    res.status(204).end();
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
})

app.get("/health",(req, res) => {
  return res.status(200).json({ status: "ok" });
})

app.listen(port, () => console.log(`server is listening on port ${port}`));