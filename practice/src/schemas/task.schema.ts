import * as z from "zod";

const Status = z.literal(["todo", "in_progress", "done"]);
const Priority = z.literal(["low", "medium", "high"]);

const TaskQuery = z.object({
  projectId: z.coerce.number().int().min(1),
  status: Status.optional(),
  sort: z.literal(["createdAt", "-createdAt", "dueDate", "-dueDate"]).default("-createdAt"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

const Task = z.object({
  projectId: z.coerce.number().int().min(1),
  title: z.string().trim().min(1).max(100),
  priority: Priority.default("medium"),
  dueDate: z.coerce.date().refine(
    (date) => date > new Date(), { error: "Date must be in the future" }
  ).optional()
})

const UpdateTask = z.object({
  status: Status.optional(),
  title: z.string().trim().min(1).max(100).optional(),
  priority: z.literal(["low", "medium", "high"]).optional(),
  dueDate: z.coerce.date().refine(
    (date) => date > new Date(), { error: "Date must be in the future" }
  ).optional()
})

const StoredTask = Task.omit({ dueDate: true }).extend({
  id: z.number().int(),
  status: Status,
  dueDate: z.string().optional(),
  createdAt: z.string(),
  completedAt: z.string().nullable()
})

const TaskId = z.object({ id: z.coerce.number().int().min(0) });

export {
  TaskQuery,
  Task,
  TaskId,
  UpdateTask,
  StoredTask
};

type TaskCreateInput = z.infer<typeof Task>;
type TaskQueryInput = z.infer<typeof TaskQuery>;
type TaskIdInput = z.infer<typeof TaskId>;
type TaskUpdateInput = z.infer<typeof UpdateTask>;
type TaskData = Omit<z.infer<typeof StoredTask>, "id">

export type { 
  TaskCreateInput,
  TaskQueryInput,
  TaskIdInput,
  TaskUpdateInput,
  TaskData,
};
