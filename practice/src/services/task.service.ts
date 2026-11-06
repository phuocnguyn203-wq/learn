import { NotFoundError } from "../errors/app-error.js";
import { TaskRepository, ProjectRepository } from "../repositories/repository.types.js";
import { TaskCreateInput, TaskData, TaskQueryInput, TaskUpdateInput } from "../schemas/task.schema.js";

const notFoundError = new NotFoundError("task not found")
type User = {
  id: number,
  role: "admin" | "user"
}
export default class TaskService {
  taskRepo: TaskRepository;
  projectRepo: ProjectRepository;
  constructor(taskRepo: TaskRepository, projectRepo: ProjectRepository) {
    this.taskRepo = taskRepo;
    this.projectRepo = projectRepo;
  }

  async assertProjectExists(projectId: number) {
    if (await this.projectRepo.findById(projectId) === null) {
      throw new NotFoundError("project not found");
    }
  }

  async getById(id: number, actor: User) {
    const task = await this.taskRepo.findById(id);
    if (task === null) { throw notFoundError; }
    const memberRole = await this.projectRepo.findRole(task.projectId, actor.id)

    if (actor.role !== "admin") {
      if (!memberRole) { throw notFoundError }
    }

    return task;
  }

  async list(query: TaskQueryInput, actor: User) {
    await this.assertProjectExists(query.projectId);
    const memberRole = await this.projectRepo.findRole(query.projectId, actor.id)
    if (actor.role !== "admin") {
      if (!memberRole) {
        throw notFoundError
      }
    }
    const { items, total } = await this.taskRepo.findMany(query);
    return {
      data: items,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async create({ projectId, title, priority, dueDate }: TaskCreateInput, actor: User) {
    await this.assertProjectExists(projectId);
    const memberRole = await this.projectRepo.findRole(projectId, actor.id)
    if (actor.role !== "admin") {
      if (!memberRole) {
        throw new NotFoundError("project not found")
      }
    }
    return await this.taskRepo.create({
      projectId,
      title,
      priority,
      status: "todo",
      dueDate: dueDate?.toISOString(),
      createdAt: new Date().toISOString(),
      completedAt: null,
    });
  }

  async update(id: number, { dueDate, ...rest }: TaskUpdateInput, actor: User) {
    
    const fields: Partial<TaskData> = { ...rest };
    if (dueDate) {
      fields.dueDate = dueDate.toISOString();
    }

    const oldTask = await this.taskRepo.findById(id)
    if (!oldTask) {
      throw new NotFoundError("task not found")
    }

    if (rest.status && oldTask.status !== rest.status) {
      fields.completedAt = rest.status === "done" ? new Date().toISOString() : null;
    }
    

    const memberRole = await this.projectRepo.findRole(oldTask.projectId, actor.id)
    if (actor.role !== "admin") {
      if (!memberRole) {
        throw new NotFoundError("project not found")
      }
    }
    const task = await this.taskRepo.update(id, fields);
    if (task === null) { throw notFoundError }
    
    return task;
  }

  async delete(id: number, actor: User) {
    const oldTask = await this.taskRepo.findById(id)
    if (!oldTask) {
      throw new NotFoundError("not found error")
    }

    const memberRole = await this.projectRepo.findRole(oldTask.projectId, actor.id)
    if (actor.role !== "admin") {
      if (!memberRole) {
        throw new NotFoundError("project not found")
      }
    }

    await this.taskRepo.delete(id)
  }

  async move(taskId: number, projectId: number, actor: User) {
    const task = await this.taskRepo.findById(taskId)
    if (!task) {
      throw new NotFoundError("project or task not found")
    }
    const memberRoleFrom = await this.projectRepo.findRole(task.projectId, actor.id)
    const memberRoleTo = await this.projectRepo.findRole(projectId, actor.id)
    if (actor.role !== "admin") {
      if (!(memberRoleFrom && memberRoleTo)) {
        throw new NotFoundError("project or task not found")
      }
    }
    
    const result = await this.taskRepo.move(taskId, projectId)
    if (result == null) {
      throw new NotFoundError("project or task not found")
    }

    return result
  }
}
