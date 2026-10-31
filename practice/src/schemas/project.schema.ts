import * as z from "zod";

const Project = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1),
})

const UpdateProject = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().min(1).optional(),
})

const ProjectId = z.object({ id: z.coerce.number().int().min(0) })

const StoredProject = Project.extend({
  id: z.number(),
  createdAt: z.string(),
})

export {
  Project,
  UpdateProject,
  ProjectId,
  StoredProject,
};

type ProjectCreateInput = z.infer<typeof Project>;
type ProjectUpdateInput = z.infer<typeof UpdateProject>;
type ProjectIdInput = z.infer<typeof ProjectId>;
type ProjectData = Omit<z.infer<typeof StoredProject>, "id">;

export type {
  ProjectCreateInput,
  ProjectUpdateInput,
  ProjectIdInput,
  ProjectData,
}
