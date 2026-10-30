import type { TaskRepository } from "./repository.types.ts"
import type { Task } from "../../generated/prisma/client.js"
import { TaskData, TaskQueryInput } from "../schemas/task.schema.js";
import type { PrismaClient } from "../../generated/prisma/client.js"

function toTask(row: Task) {
  return {
    ...row,
    dueDate: row.dueDate?.toISOString(),
    createdAt: row.createdAt.toISOString(),
    completedAt: row.completedAt?.toISOString() ?? null
  }
}
export class TaskPrismaRepository implements TaskRepository {
  client: PrismaClient
  constructor(client: PrismaClient) {
    this.client = client;
  }
  async countByProjectId(projectId: number): Promise<number> {
    const result = await this.client.task.count({
      where: {projectId: projectId}
    })
    return result
  }

  async findMany(query: TaskQueryInput) {
    const where = { projectId: query.projectId, status: query.status }
    const dir = query.sort.startsWith("-") ? -1 : 1;
    const key = query.sort.endsWith("createdAt") ? "createdAt" : "dueDate"
    const [rows, total] = await Promise.all([
      this.client.task.findMany({
        where, orderBy: { [key]: dir === 1 ? "asc" : "desc" },
        skip: (query.page - 1) * query.limit, take: query.limit
      }),
      this.client.task.count({ where })
    ]);

    return {
      items: rows.map(toTask),
      total: total
    }
  }
  async findAll() {
    const tasks = [];
    const rows = await this.client.task.findMany()
    for (const row of rows) {
      tasks.push(toTask(row))
    }
    return tasks
  }

  async findById(id: number) {
    const row = await this.client.task.findUnique({
      where: {id: id}
    })
    return row ? toTask(row) : row
  }

  async create(data: TaskData) {
    const row = await this.client.task.create({
      data: data
    })
    return toTask(row)
  }

  async update(id: number, fields: Partial<Omit<TaskData, "id">>) {
    const existRow = await this.findById(id);
    if (! existRow) { return null; }
    const row = await this.client.task.update({
      where: {id: id},
      data: fields
    })

    return toTask(row)
  }

  async delete(id: number) {
    const row = await this.client.task.deleteMany({
      where: {id: id}
    })
    return row.count !==0 ? true : false
  }
}