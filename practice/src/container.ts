import bcrypt from "bcrypt";
import { TaskPrismaRepository } from "./repositories/task-repository.prisma.js";
import { ProjectPrismaRepository } from "./repositories/project-repository.prisma.js";
import { UserPrismaRepository } from "./repositories/user-repository.prisma.js";
import { AuthPrismaRepository } from "./repositories/auth-repository.prisma.js";
import TaskService from "./services/task.service.js";
import ProjectService from "./services/project.service.js";
import UserService from "./services/user.service.js";
import AuthService from "./services/auth.service.js";
import { createPrisma } from "./db/prisma.js";

// Thiếu secret thì không cho server chạy lên
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) { throw new Error("JWT_SECRET is not set"); }

const client = createPrisma()

const taskRepo = new TaskPrismaRepository(client);
const projectRepo = new ProjectPrismaRepository(client);
const userRepo = new UserPrismaRepository(client);
const authRepo = new AuthPrismaRepository(client);

const hasher = {
  hash: (pw: string) => bcrypt.hash(pw, 10),
  compare: bcrypt.compare,
};

export const taskService = new TaskService(taskRepo, projectRepo);
export const projectService = new ProjectService(projectRepo, taskRepo);
export const userService = new UserService(userRepo, hasher);
export const authService = new AuthService(userRepo, authRepo, hasher, jwtSecret);
