import { PrismaClient, Project, Prisma } from "../../generated/prisma/client.js";
import { ProjectData } from "../schemas/project.schema.js";
import type { ProjectRepository } from "./repository.types.js";

function toProject<T extends Project>(row: T) {
  return { ...row, createdAt: row.createdAt.toISOString() };
}

export class ProjectPrismaRepository implements ProjectRepository {
  client: PrismaClient
  constructor(client: PrismaClient) {
    this.client = client;
  }

  async findAll(userId?: number) { //admin sees all
    const allProjects = await this.client.$queryRaw<(Project & { taskCount: number, doneCount: number})[]>`
      SELECT p.id, p.name, p.description, p.user_id AS "userId", p.created_at AS "createdAt",
      COUNT(t.id):: int AS "taskCount", COUNT(t.id) FILTER (WHERE t.status = 'done'):: int AS "doneCount"
      FROM projects p LEFT JOIN
      tasks t ON p.id = t.project_id
      ${userId === undefined ? Prisma.empty : Prisma.sql`WHERE p.id IN (SELECT project_id FROM project_members WHERE user_id = ${userId})`}

      GROUP BY p.id
    `

    return allProjects.map(toProject);
  }

  async findById(id: number) {
    const row = await this.client.project.findUnique({
      where: { id: id}
    })

    return row ? toProject(row) : null;
  }

  async create(data: ProjectData, userId: number) {
    const row = await this.client.project.create({
      data: { ...data, userId, members: { create: { userId, role: "owner" } } },
    });

    return toProject(row);
  }

  async update(id: number, fields: Partial<ProjectData>) {
    const isExist = await this.findById(id);
    if (!isExist) { return null; }
    const row = await this.client.project.update({
      where: {id: id},
      data: fields
    })
    
    return toProject(row);
  }

  async delete(id: number) {
    const row = await this.client.project.deleteMany({
      where: { id: id }
    })

    return row.count !== 0 ? true : false
  }

  async findRole(projectId: number, userId: number) {
    const projectMember = await this.client.projectMember.findUnique({
      where: {userId_projectId: { userId, projectId }}
    })

    return projectMember ? projectMember.role : null
  }

  async addMember(projectId: number, userId: number) {
    await this.client.projectMember.create({
      data: {
        projectId, userId, role: "member"
      }
    })
  }

  async removeMember(projectId: number, userId: number) {
    const projectMember = await this.client.projectMember.deleteMany({
      where: { projectId, userId }
    })
    return projectMember.count !== 0 ? true : false
    
  }
}