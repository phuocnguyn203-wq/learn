import * as z from "zod";

const Project = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1),
})

const UpdateProject = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().min(1).optional(),
})

const ProjectId = z.object({ id: z.coerce.number().int().min(0) });


export { Project, UpdateProject, ProjectId };