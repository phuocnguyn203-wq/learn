import { NotFoundError } from "../errors/app-error.js";

export default class TaskService {
  constructor(taskRepo, projectRepo) {
    this.taskRepo = taskRepo;
    this.projectRepo = projectRepo;
  }

  assertProjectExists(projectId) {
    if (this.projectRepo.findById(projectId) === null) {
      throw new NotFoundError("project not found");
    }
  }

  getById(id) {
    const task = this.taskRepo.findById(id);
    if (task === null) { throw new NotFoundError("task not found"); }
    return task;
  }

  list(query) {
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

  create({ projectId, title, priority, dueDate }) {
    this.assertProjectExists(projectId);
    return this.taskRepo.create({
      projectId,
      title,
      priority,
      status: "todo",
      dueDate: dueDate?.toISOString() ?? null,
      createdAt: new Date().toISOString(),
      completedAt: null,
    });
  }

  async update(id, fields) {
    if (fields.status) {
      fields = { ...fields, completedAt: fields.status === "done" ? new Date().toISOString() : null };
    }
    const task = await this.taskRepo.update(id, fields);
    if (task === null) { throw new NotFoundError("task not found"); }
    return task;
  }

  async delete(id) {
    if (!(await this.taskRepo.delete(id))) {
      throw new NotFoundError("task not found");
    }
  }
}
