import { ProjectData } from "../schemas/project.schema.js"
import { TaskData, TaskQueryInput } from "../schemas/task.schema.js";
interface Repository<T> {
  findAll(): (T & { id: number })[];
  findById(id: number): T & { id: number } | null;
  create(data: T) : Promise<T & { id: number }>;
  update(id: number, fields: Partial<T>) : Promise<T & { id: number } | null>;
  delete(id: number): Promise<boolean>;
}

interface ProjectRepository extends Repository<ProjectData> {}

interface TaskRepository extends Repository<TaskData> {
  findMany(query: TaskQueryInput): { items: (TaskData & { id: number })[], total: number };
  countByProjectId(projectId: number): number;
}

export { ProjectRepository, TaskRepository}