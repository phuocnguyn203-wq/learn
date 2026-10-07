import * as z from "zod";

const TaskQuery = z.object({
  projectId: z.coerce.number().int().min(1),
  status: z.literal(["in_progress", "done"]).optional(),
  sort: z.literal(["createdAt", "-createdAt", "dueDate", "-dueDate"]).default("-createdAt"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

const Task = z.object({
  projectId: z.coerce.number().int().min(1),
  title: z.string().trim().min(1).max(100),
  priority: z.literal(["low", "medium", "high"]).default("medium"),
  dueDate: z.coerce.date().refine(
    (date) => date > new Date(), { error: "Date must be in the future" }
  ).optional()
})

const UpdateTask = z.object({
  title: z.string().trim().min(1).max(100).optional(),
  priority: z.literal(["low", "medium", "high"]).optional(),
  dueDate: z.coerce.date().refine(
    (date) => date > new Date(), { error: "Date must be in the future" }
  ).optional()
})

const TaskId = z.object({ id: z.coerce.number().int().min(0) });

export { TaskQuery, Task, TaskId, UpdateTask };
