import { readFile, writeFile } from "node:fs/promises";
export default class ProjectStore {
  constructor(filename) {
    this.filename = filename;
  }

  static async create(filename) {
    const projectStore = new ProjectStore(filename);
    let data = await readFile(filename);
    if (data.length === 0) {
      data = [];
    } else {
      data = JSON.parse(data);
    }
    projectStore.projects = data;
    return projectStore
  }

  async save() {
    await writeFile(this.filename, JSON.stringify(this.projects));
  }

  getNewId() {
    const projects = this.projects;
    const projectLength = projects.length;
    return projects[projectLength - 1] ? projects[proejctLength-1]["id"] + 1 : 1; 
  }

  checkIdExist(id) {
    for (const p of this.projects) {
      if (p["id"] === id) { return true; }
    }
    return false;
  }

  *fetchAllProjects() {
    yield* this.projects;
  }

  fetchProjectById(id) {
    for (const p of this.projects) {
      if (p["id"] === id) {
        return p;
      }
    }
    return null;
  }

  async createProject(name, description) {
    const createdAt = (new Date()).toISOString();
    const id = this.getNewId();
    const p = { id, name, description, createdAt };
    this.projects.push(p);
    await this.save();
    return p;
  }

  async deleteProject(id) {
    for (const [idx, p] of Object.entries(this.projects)) {
      if (p["id"] == id) {
        this.projects.splice(idx, 1);
        await this.save();
        return true;
      }
    }
    return false;
  }

  async updateProject(id, newField) {
    const p = this.fetchProjectById(id);
    if (p == null) { return null; }
    for (const prop in newField) {
      if (p.hasOwnProperty(prop)) {
        p[prop] = newField[prop];
      }
    }
    await this.save();
    return p;
  }
}