import { ProjectData } from "../schemas/project.schema.js"
import { TaskData, TaskQueryInput } from "../schemas/task.schema.js";
interface Repository<T> {
  findAll(): Promise<(T & { id: number })[]>;
  findById(id: number): Promise<T & { id: number } | null>;
  create(data: T) : Promise<T & { id: number }>;
  update(id: number, fields: Partial<T>) : Promise<T & { id: number } | null>;
  delete(id: number): Promise<boolean>;
}

interface ProjectRepository extends Omit<Repository<ProjectData>, "create" | "findAll"> {
  findAll(projectId?: number): Promise<(ProjectData & { id: number })[]>;
  create(data: ProjectData, userId: number): Promise<ProjectData & { id: number }>;
  findRole(projectId: number, userId: number): Promise<"owner" | "member" | null>
  addMember(projectId: number, userId: number): Promise<void>
  removeMember(projectId: number, userId: number): Promise<boolean>
}


interface TaskRepository extends Repository<TaskData> {
  findMany(query: TaskQueryInput): Promise<{ items: (TaskData & { id: number })[], total: number }>;
  countByProjectId(projectId: number, status?: "done" | "in_progress" | "todo"): Promise<number>;
  move(taskId: number, targetProjectId: number): Promise<TaskData  & { id: number } | null>
}

type UserRow = { id: number, email: string, role: "admin" | "user", hashedPassword: string, createdAt: string };
interface UserRepository {
  findByEmail(email: string): Promise<UserRow | null>
  findById(id: number): Promise<UserRow | null>
  create(email: string, name: string, hashedPassword: string): Promise<UserRow>
}

type RefreshTokenRow = { id: number, userId: number, tokenHash: string, expiresAt: string, revokedAt: string | null };

interface AuthRepository {
  create(userId: number, tokenHash: string): Promise<RefreshTokenRow>
  findByHash(tokenHash: string): Promise<RefreshTokenRow | null>
  rotate(oldId: number, userId: number, newHash: string): Promise<RefreshTokenRow | null>
  revoke(id: number): Promise<void>
  revokeAllByUser(userId: number): Promise<void>
}

export { UserRow }
export { ProjectRepository, TaskRepository, UserRepository, AuthRepository }