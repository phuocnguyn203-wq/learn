import { PrismaClient, Project } from "../../generated/prisma/client.js";
import { ProjectData } from "../schemas/project.schema.js";
import type { ProjectRepository } from "./repository.types.js";

function toProject(row: Project) {
  return { ...row, createdAt: row.createdAt.toISOString() };
}

export class ProjectPrismaRepository implements ProjectRepository {
  client: PrismaClient
  constructor(client: PrismaClient) {
    this.client = client;
  }

  async findAll() {
    return (await this.client.project.findMany()).map(toProject);
  }

  async findById(id: number) {
    const row = await this.client.project.findUnique({
      where: { id: id}
    })

    return row ? toProject(row) : null;
  }

  async create(data: ProjectData) {
    const row = await this.client.project.create({
      data: { ...data, userId: 1 }
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

}