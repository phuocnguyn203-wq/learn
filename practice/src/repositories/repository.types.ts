import { ProjectData } from "../schemas/project.schema.js"
import { TaskData, TaskQueryInput } from "../schemas/task.schema.js";
interface Repository<T> {
  findAll(): Promise<(T & { id: number })[]>;
  findById(id: number): Promise<T & { id: number } | null>;
  create(data: T) : Promise<T & { id: number }>;
  update(id: number, fields: Partial<T>) : Promise<T & { id: number } | null>;
  delete(id: number): Promise<boolean>;
}

interface ProjectRepository extends Repository<ProjectData> {
  findAll(): Promise<(ProjectData & { id: number, taskCount: number, doneCount: number})[]>
}

interface TaskRepository extends Repository<TaskData> {
  findMany(query: TaskQueryInput): Promise<{ items: (TaskData & { id: number })[], total: number }>;
  countByProjectId(projectId: number, status?: "done" | "in_progress" | "todo"): Promise<number>;
  move(taskId: number, targetProjectId: number): Promise<TaskData  & { id: number } | null>
}

export { ProjectRepository, TaskRepository}