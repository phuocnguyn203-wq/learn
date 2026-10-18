import * as z from "zod";
import { readFile, writeFile } from "node:fs/promises";
import { InMemoryRepository, InMemoryTaskRepository } from "./in-memory.repository.js";
import { TaskRepository, ProjectRepository } from "./repository.types.js";
import { StoredTask } from "../schemas/task.schema.js";
import { StoredProject } from "../schemas/project.schema.js";
import type { ProjectData } from "../schemas/project.schema.js";
import type { TaskData } from "../schemas/task.schema.js";
//TODO: add type latter
async function loadJson<S extends z.ZodType>(filename: string, schema: S): Promise<z.infer<S>> {
  let text = await readFile(filename, "utf8");
  let data: unknown = text.length === 0 ? [] : JSON.parse(text);
  return schema.parse(data);
}

export class JsonFileRepository extends InMemoryRepository<ProjectData> implements ProjectRepository{
  filename: string
  constructor(filename: string, items: (ProjectData & { id: number })[]) {
    super(items);
    this.filename = filename;
  }

  static async create(filename: string) {
    const result = await loadJson(filename, z.array(StoredProject));
    return new this(filename, result);
  }

  async save() {
    await writeFile(this.filename, JSON.stringify(this.items));
  }
}

export class JsonFileTaskRepository extends InMemoryTaskRepository implements TaskRepository {
  filename: string
  constructor(filename: string, items: (TaskData & { id: number })[]) {
    super(items);
    this.filename = filename;
  }

  static async create(filename: string) {
    const result = await loadJson(filename, z.array(StoredTask));
    return new this(filename, result);
  }

  async save() {
    await writeFile(this.filename, JSON.stringify(this.items));
  }
}
