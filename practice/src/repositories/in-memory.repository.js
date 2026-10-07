export class InMemoryRepository {
  constructor(items = []) {
    this.items = items;
  }

  // Lưu trong mảng thì không cần làm gì; JsonFile ghi đè để ghi ra file
  async save() {}

  getNewId() {
    const last = this.items.at(-1);
    return last ? last.id + 1 : 1;
  }

  findAll() {
    return this.items;
  }

  findById(id) {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async create(data) {
    const item = { id: this.getNewId(), ...data };
    this.items.push(item);
    await this.save();
    return item;
  }

  async update(id, fields) {
    const item = this.findById(id);
    if (item === null) { return null; }
    Object.assign(item, fields);
    await this.save();
    return item;
  }

  async delete(id) {
    const idx = this.items.findIndex((item) => item.id === id);
    if (idx === -1) { return false; }
    this.items.splice(idx, 1);
    await this.save();
    return true;
  }
}

export class InMemoryTaskRepository extends InMemoryRepository {
  findMany({ projectId, status, sort, page, limit }) {
    const tasks = this.items.filter(
      (t) => t.projectId === projectId && (!status || t.status === status)
    );
    const key = sort.replace("-", "");
    const dir = sort.startsWith("-") ? -1 : 1;
    tasks.sort((a, b) => dir * (new Date(a[key]) - new Date(b[key])));
    return {
      items: tasks.slice((page - 1) * limit, page * limit),
      total: tasks.length,
    };
  }

  countByProjectId(projectId) {
    return this.items.filter((t) => t.projectId === projectId).length;
  }
}
