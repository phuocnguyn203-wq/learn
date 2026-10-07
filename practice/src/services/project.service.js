import { NotFoundError, ConflictError } from "../errors/app-error.js";

export default class ProjectService {
  constructor(projectRepo, taskRepo) {
    this.projectRepo = projectRepo;
    this.taskRepo = taskRepo;
  }

  list() {
    return this.projectRepo.findAll();
  }

  getById(id) {
    const project = this.projectRepo.findById(id);
    if (project === null) { throw new NotFoundError("project not found"); }
    return project;
  }

  create({ name, description }) {
    return this.projectRepo.create({
      name,
      description,
      createdAt: new Date().toISOString(),
    });
  }

  async update(id, fields) {
    const project = await this.projectRepo.update(id, fields);
    if (project === null) { throw new NotFoundError("project not found"); }
    return project;
  }

  async delete(id) {
    this.getById(id);
    if (this.taskRepo.countByProjectId(id) > 0) {
      throw new ConflictError("project still has tasks");
    }
    await this.projectRepo.delete(id);
  }
}
