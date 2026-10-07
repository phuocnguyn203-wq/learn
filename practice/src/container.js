import { InMemoryRepository, InMemoryTaskRepository } from "./repositories/in-memory.repository.js";
import { JsonFileRepository, JsonFileTaskRepository } from "./repositories/json-file.repository.js";
import TaskService from "./services/task.service.js";
import ProjectService from "./services/project.service.js";

function createInMemoryRepos() {
  return {
    taskRepo: new InMemoryTaskRepository(),
    projectRepo: new InMemoryRepository(),
  };
}

async function createJsonFileRepos() {
  return {
    taskRepo: await JsonFileTaskRepository.create("../data/task.json"),
    projectRepo: await JsonFileRepository.create("../data/project.json"),
  };
}

const { taskRepo, projectRepo } = await createJsonFileRepos();

export const taskService = new TaskService(taskRepo, projectRepo);
export const projectService = new ProjectService(projectRepo, taskRepo);
