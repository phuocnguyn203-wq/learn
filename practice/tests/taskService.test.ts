import { beforeEach, describe, expect, it, vi } from "vitest";
import TaskService from "../src/services/task.service.js";
import { NotFoundError } from "../src/errors/app-error.js";
import type { ProjectRepository, TaskRepository } from "../src/repositories/repository.types.js";
const actor = { id: 1, role: "user" as const };
const input = { projectId: 5, title: "T1", priority: "medium" as const }

describe("TaskService.create", () => {
  let taskRepo: { create: ReturnType<typeof vi.fn> }
  let projectRepo: { findById: ReturnType<typeof vi.fn>, findRole: ReturnType<typeof vi.fn> };
  let service: TaskService;

  beforeEach(() => {
    taskRepo = { create: vi.fn() }
    projectRepo = { findById: vi.fn(), findRole: vi.fn() }
    service = new TaskService(
      taskRepo as unknown as TaskRepository,
      projectRepo as unknown as ProjectRepository
    );
  })

  it("it throws NotFoundError when project doesn't exist", async () => {
    projectRepo.findById.mockResolvedValue(null);
    await expect(service.create(input, actor)).rejects.toThrow(NotFoundError);
    expect(taskRepo.create).not.toHaveBeenCalled()
  })

  it("creates task successfully", async () => {
    projectRepo.findById.mockResolvedValue({ id: 5 });
    projectRepo.findRole.mockResolvedValue("member");
    taskRepo.create.mockResolvedValue({ id: 1, title: "T1" })
    
    await service.create(input, actor);
    expect(taskRepo.create).toHaveBeenCalledWith(expect.objectContaining({
      projectId: 5,
      title: "T1",
      status: "todo",
      completedAt: null,
      createdAt: expect.any(String),
    }));

  })
})

const updateInput = { status: "done" as const }
const taskId = 1
describe("TaskService.update", () => {
  let taskRepo: { findById: ReturnType<typeof vi.fn>, update: ReturnType<typeof vi.fn> }
  let projectRepo: { findRole: ReturnType<typeof vi.fn> };
  let service: TaskService;

  beforeEach(() => {
    taskRepo = { findById: vi.fn(), update: vi.fn() }
    projectRepo = { findRole: vi.fn() }
    service = new TaskService(
      taskRepo as unknown as TaskRepository,
      projectRepo as unknown as ProjectRepository
    );
  })

  it("completed task has completedAt", async () => {
    taskRepo.findById.mockResolvedValue({ id: 1, projectId: 5 });
    projectRepo.findRole.mockResolvedValue("member");
    taskRepo.update.mockResolvedValue({ id: 1 });

    await service.update(taskId, updateInput, actor);

    expect(taskRepo.update).toHaveBeenCalledWith(
      taskId,
      expect.objectContaining({ status: "done", completedAt: expect.any(String) }),
    );
  });

  it("doesn't change completedAt when asked for finishing task", async () => {
    taskRepo.findById.mockResolvedValue({ id: 1, projectId: 5, status: "done" })
    projectRepo.findRole.mockResolvedValue("member")
    
    await service.update(taskId, updateInput, actor)
    expect(taskRepo.update.mock.calls[0][1]).not.toHaveProperty("completedAt");

  })
})

describe("TaskService.move", () => {
  let taskRepo: { findById: ReturnType<typeof vi.fn>, move: ReturnType<typeof vi.fn> };
  let projectRepo: { findRole: ReturnType<typeof vi.fn> }
  let service: TaskService;

  let actor = { id: 1, role: "user" as const }

  beforeEach(() => {
    taskRepo = { findById: vi.fn(), move: vi.fn() }
    projectRepo = { findRole: vi.fn() }
    service = new TaskService(
      taskRepo as unknown as TaskRepository,
      projectRepo as unknown as ProjectRepository
    )
  })

  it("moves task successfully", async () => {
    const taskId = 1;
    const toProjectId = 3;
    taskRepo.findById.mockResolvedValue({ id: taskId, projectId: 5 })
    taskRepo.move.mockResolvedValue("randomThing") 
    projectRepo.findRole.mockResolvedValue("member")

    await service.move(taskId, toProjectId, actor)
    expect(taskRepo.move).toHaveBeenCalledWith(taskId, toProjectId)
  })

  it("throw NotFoundError when moved to non-existent project", async () => {
    const taskId = 1;
    const toProjectId = 1000;
    
    taskRepo.findById.mockResolvedValue({ id: taskId, projectId: 5 });
    projectRepo.findRole.mockImplementation((projectId: number, userId: number) => {
      if (projectId === 5 && userId === 1) {
        return "member";
      }
      return null;
    })
    
    await expect(service.move(taskId, toProjectId, actor)).rejects.toThrow(NotFoundError);
    expect(taskRepo.move).not.toHaveBeenCalled();
  })

  
})

describe("TaskService.list", () => {
  let taskRepo: { findMany: ReturnType<typeof vi.fn> };
  let projectRepo: { findRole: ReturnType<typeof vi.fn>, findById: ReturnType<typeof vi.fn> }
  let service: TaskService;

  let actor = { id: 1, role: "user" as const }

  beforeEach(() => {
    taskRepo = { findMany: vi.fn() }
    projectRepo = { findRole: vi.fn(), findById: vi.fn() }
    service = new TaskService(
      taskRepo as unknown as TaskRepository,
      projectRepo as unknown as ProjectRepository
    )
  })

  it.each([[0, 0], [10, 1], [27, 3]])("total %i -> %i page(s)", async (total, expected) => {
    const query = {
      projectId: 1,
      sort: "dueDate" as const,
      page: 1,
      limit: 10,
      status: "done" as const
    }

    taskRepo.findMany.mockResolvedValue({ total });
    projectRepo.findById.mockResolvedValue({ id: 1 });
    projectRepo.findRole.mockResolvedValue("member");
    
    const result = await service.list(query, actor);
    expect(result.meta.totalPages).toEqual(expected)
  })
})
