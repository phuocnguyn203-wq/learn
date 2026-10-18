import type { TaskQueryInput, TaskData } from "../schemas/task.schema.js";
import { TaskRepository } from "./repository.types.js";
export class InMemoryRepository<T>{
  items: (T & { id: number })[];
  constructor(items: (T & { id: number })[] = []) {
    this.items = items;
  }

  // Lưu trong mảng thì không cần làm gì; JsonFile ghi đè để ghi ra file
  async save() {}

  getNewId() {
    const last = this.items.at(-1);
    return last ? last.id + 1 : 1;
  }

  findAll() {
    return this.items;
  }

  findById(id: number) {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async create(data: T) {
    const item = { id: this.getNewId(), ...data };
    this.items.push(item);
    await this.save();
    return item;
  }

  async update(id: number, fields: Partial<T>) {
    const item = this.findById(id);
    if (item === null) { return null; }
    Object.assign(item, fields);
    await this.save();
    return item;
  }

  async delete(id: number) {
    const idx = this.items.findIndex((item) => item.id === id);
    if (idx === -1) { return false; }
    this.items.splice(idx, 1);
    await this.save();
    return true;
  }
}

export class InMemoryTaskRepository extends InMemoryRepository<TaskData> implements TaskRepository {
  findMany({ projectId, status, sort, page, limit }: TaskQueryInput) {
    const tasks = this.items.filter(
      (t) => t.projectId === projectId && (!status || t.status === status)
    );
    const key = sort.endsWith("createdAt") ? "createdAt" : "dueDate";
    const dir = sort.startsWith("-") ? -1 : 1;
    tasks.sort((a, b) => {
      if (a[key] === b[key]) { return 0;}

      if (a[key] === undefined) { return 1; }

      if (b[key] === undefined) { return -1; }

      return dir * (a[key] >= b[key] ? 1 : -1);
    });
    return {
      items: tasks.slice((page - 1) * limit, page * limit),
      total: tasks.length,
    };
  }

  countByProjectId(projectId: number) {
    return this.items.filter((t) => t.projectId === projectId).length;
  }
}
