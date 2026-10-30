import { TaskPrismaRepository } from "./repositories/task-repository.prisma.js";
import { ProjectPrismaRepository } from "./repositories/project-repository.prisma.js";
import TaskService from "./services/task.service.js";
import ProjectService from "./services/project.service.js";
import { createPrisma } from "./db/prisma.js";

const client = createPrisma()

async function createJsonFileRepos() {
  return {
    taskRepo: new TaskPrismaRepository(client),
    projectRepo: new ProjectPrismaRepository(client),
  };
}

const { taskRepo, projectRepo } = await createJsonFileRepos();

export const taskService = new TaskService(taskRepo, projectRepo);
export const projectService = new ProjectService(projectRepo, taskRepo);
