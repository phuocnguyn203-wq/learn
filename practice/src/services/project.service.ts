import { NotFoundError, ConflictError } from "../errors/app-error.js";
import { ProjectRepository, TaskRepository } from "../repositories/repository.types.js";
import { ProjectCreateInput, ProjectUpdateInput } from "../schemas/project.schema.js";
export default class ProjectService {
  projectRepo: ProjectRepository;
  taskRepo: TaskRepository;
  constructor(projectRepo: ProjectRepository, taskRepo: TaskRepository) {
    this.projectRepo = projectRepo;
    this.taskRepo = taskRepo;
  }

  async list() {
    const result = []
    const projects = await this.projectRepo.findAll();
    for (const proj of projects) {
      const taskCount = await this.taskRepo.countByProjectId(proj.id);
      const doneCount = await this.taskRepo.countByProjectId(proj.id, "done")
      result.push({ ...proj, taskCount, doneCount })
    }

    return result
  }

  async getById(id: number) {
    const project = await this.projectRepo.findById(id);
    if (project === null) { throw new NotFoundError("project not found"); }
    return project;
  }

  async create({ name, description }: ProjectCreateInput) {
    return await this.projectRepo.create({
      name,
      description,
      createdAt: new Date().toISOString(),
    });
  }

  async update(id: number, fields: ProjectUpdateInput) {
    const project = await this.projectRepo.update(id, fields);
    if (project === null) { throw new NotFoundError("project not found"); }
    return project;
  }

  async delete(id: number) {
    await this.getById(id);
    if (await this.taskRepo.countByProjectId(id) > 0) {
      throw new ConflictError("project still has tasks");
    }
    await this.projectRepo.delete(id);
  }
}
