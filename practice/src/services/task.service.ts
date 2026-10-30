import { NotFoundError } from "../errors/app-error.js";
import { TaskRepository, ProjectRepository } from "../repositories/repository.types.js";
import { TaskCreateInput, TaskData, TaskQueryInput, TaskUpdateInput } from "../schemas/task.schema.js";
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

  async getById(id: number) {
    const task = await this.taskRepo.findById(id);
    if (task === null) { throw new NotFoundError("task not found"); }
    return task;
  }

  async list(query: TaskQueryInput) {
    await this.assertProjectExists(query.projectId);
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

  async create({ projectId, title, priority, dueDate }: TaskCreateInput) {
    await this.assertProjectExists(projectId);
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

  async update(id: number, { dueDate, ...rest }: TaskUpdateInput) {
    const fields: Partial<TaskData> = { ...rest };
    if (dueDate) {
      fields.dueDate = dueDate.toISOString();
    }
    if (rest.status) {
      fields.completedAt = rest.status === "done" ? new Date().toISOString() : null;
    }
    const task = await this.taskRepo.update(id, fields);
    if (task === null) { throw new NotFoundError("task not found"); }
    return task;
  }

  async delete(id: number) {
    if (!(await this.taskRepo.delete(id))) {
      throw new NotFoundError("task not found");
    }
  }
}
