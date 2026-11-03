import { NotFoundError, ConflictError } from "../errors/app-error.js";
import { ProjectRepository, TaskRepository, UserRepository } from "../repositories/repository.types.js";
import { ProjectCreateInput, ProjectUpdateInput } from "../schemas/project.schema.js";

const notFoundError = new NotFoundError("project not found")
type User = {
  id: number,
  role: "admin" | "user"
}
export default class ProjectService {
  projectRepo: ProjectRepository;
  taskRepo: TaskRepository;
  userRepo: UserRepository
  constructor(projectRepo: ProjectRepository, taskRepo: TaskRepository, userRepo: UserRepository) {
    this.projectRepo = projectRepo;
    this.taskRepo = taskRepo;
    this.userRepo = userRepo
  }

  async list(actor: User) {
    const id = actor.role === "admin" ? undefined : actor.id
    return (await this.projectRepo.findAll(id));
  }

  async getById(id: number, actor: User) {
    const project = await this.projectRepo.findById(id);
    if (project === null) { throw notFoundError }
    const memberRole = await this.projectRepo.findRole(id, actor.id)
    if (actor.role !== "admin") {
      if (!memberRole) { throw notFoundError } // not found for security
    }

    return project;
  }

  async create({ name, description }: ProjectCreateInput, actor: User) {
    return await this.projectRepo.create({
      name,
      description,
      createdAt: new Date().toISOString(),
    }, actor.id);
  }

  async update(id: number, fields: ProjectUpdateInput, actor: User) {
    const memberRole = await this.projectRepo.findRole(id, actor.id)
    if (actor.role !== "admin") {
      if (memberRole !== "owner") { throw notFoundError }
    }
    
    const project = await this.projectRepo.update(id, fields);
    if (project === null) { throw notFoundError }
    
    return project;
  }

  async delete(id: number, actor: User) {
    const project = await this.projectRepo.findById(id)
    if (!project) { throw notFoundError }
    const memberRole = await this.projectRepo.findRole(id, actor.id);
    if (actor.role !== "admin") {
      if (memberRole !== "owner") { throw notFoundError }
    }
    
    if (await this.taskRepo.countByProjectId(id) > 0) {
      throw new ConflictError("project still has tasks");
    }
    await this.projectRepo.delete(id);
  }

  async addMember(projectId: number, userId: number, actor: User) {
    const memberRole = await this.projectRepo.findRole(projectId, actor.id)
    if (actor.role !== "admin") {
      if (memberRole !== "owner") {
        throw new NotFoundError("project not found")
      }
    }
    const user = await this.userRepo.findById(userId)
    if (!user) {
      throw new NotFoundError("user not found")
    }

    if (await this.projectRepo.findRole(projectId, user.id) !== null) {
      throw new ConflictError("user is already a member")
    }
    

    await this.projectRepo.addMember(projectId, userId)
  }

  async removeMember(projectId: number, userId: number, actor: User) {
    const memberRole = await this.projectRepo.findRole(projectId, actor.id)
    if (actor.role !== "admin") {
      if (memberRole !== "owner") {
        throw new NotFoundError("project not found")
      }
    }

    const roleOfDeleted = await this.projectRepo.findRole(projectId, userId)
    switch (roleOfDeleted) {
      case "owner": throw new ConflictError("can't delete owner")
      case null: throw new NotFoundError("user not found")
    }

    return await this.projectRepo.removeMember(projectId, userId)
  }
}
