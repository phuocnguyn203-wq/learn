import { readFile, writeFile } from "node:fs/promises";
import { InMemoryRepository, InMemoryTaskRepository } from "./in-memory.repository.js";

async function loadJson(filename) {
  const data = await readFile(filename, "utf8");
  return data.length === 0 ? [] : JSON.parse(data);
}

export class JsonFileRepository extends InMemoryRepository {
  constructor(filename, items) {
    super(items);
    this.filename = filename;
  }

  static async create(filename) {
    return new this(filename, await loadJson(filename));
  }

  async save() {
    await writeFile(this.filename, JSON.stringify(this.items));
  }
}

export class JsonFileTaskRepository extends InMemoryTaskRepository {
  constructor(filename, items) {
    super(items);
    this.filename = filename;
  }

  static async create(filename) {
    return new this(filename, await loadJson(filename));
  }

  async save() {
    await writeFile(this.filename, JSON.stringify(this.items));
  }
}
