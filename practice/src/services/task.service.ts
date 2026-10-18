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

  assertProjectExists(projectId: number) {
    if (this.projectRepo.findById(projectId) === null) {
      throw new NotFoundError("project not found");
    }
  }

  getById(id: number) {
    const task = this.taskRepo.findById(id);
    if (task === null) { throw new NotFoundError("task not found"); }
    return task;
  }

  list(query: TaskQueryInput) {
    this.assertProjectExists(query.projectId);
    const { items, total } = this.taskRepo.findMany(query);
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

  create({ projectId, title, priority, dueDate }: TaskCreateInput) {
    this.assertProjectExists(projectId);
    return this.taskRepo.create({
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
