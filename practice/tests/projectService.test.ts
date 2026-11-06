import { expect, it, vi, describe, beforeEach } from "vitest";
import ProjectService from "../src/services/project.service.js";
import { ConflictError, NotFoundError } from "../src/errors/app-error.js";
import type { TaskRepository, ProjectRepository, UserRepository } from "../src/repositories/repository.types.js";

describe("ProjectService.delete", () => {
  let taskRepo: { countByProjectId: ReturnType<typeof vi.fn>};
  let projectRepo: { findById: ReturnType<typeof vi.fn>, findRole: ReturnType<typeof vi.fn>, delete: ReturnType<typeof vi.fn> }
  let userRepo: {}
  let service: ProjectService
  
  const actor = { id: 1, role: "user" as const }

  beforeEach(() => {
    taskRepo = { countByProjectId: vi.fn() };
    projectRepo = { findById: vi.fn(), findRole: vi.fn(), delete: vi.fn() }
    userRepo = {}
    service = new ProjectService(
      projectRepo as unknown as ProjectRepository,
      taskRepo as unknown as TaskRepository,
      userRepo as unknown as UserRepository
    )
  })

  it("throws ConflictError when delete project that still has tasks", async () => {
    const projectId = 2;
    taskRepo.countByProjectId.mockResolvedValue(1);
    projectRepo.findById.mockResolvedValue({ id: projectId });
    projectRepo.findRole.mockResolvedValue("owner");

    await expect(service.delete(projectId, actor)).rejects.toThrow(ConflictError);
  })

  it("throw NotFoundError when user is not member", async () => {
    const projectId = 2;
    taskRepo.countByProjectId.mockResolvedValue(0);
    projectRepo.findById.mockResolvedValue({ id: projectId })
    projectRepo.findRole.mockResolvedValue(null);

    await expect(service.delete(projectId, actor)).rejects.toThrow(NotFoundError);
  })

  it("allows admin delete even he is not member", async () => {
    const projectId = 2;
    taskRepo.countByProjectId.mockResolvedValue(0);
    projectRepo.findById.mockResolvedValue({ id: projectId });
    projectRepo.findRole.mockResolvedValue(null);
    const newActor = { ...actor, role: "admin" as const };
    await service.delete(projectId, newActor);
    
    expect(projectRepo.delete).toHaveBeenCalledWith(projectId)
  })
})
