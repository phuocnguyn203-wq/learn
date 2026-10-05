import { readFile, writeFile } from "node:fs/promises";
import EventEmitter from "node:events";
export default class TaskStore extends EventEmitter {
	constructor(filename) {
    super();
    this.filename = filename;
  }

	static async create(filename) {
		const taskStore = new TaskStore(filename);
		const data = await readFile(filename, "utf8");
		let taskList;
		if (data.length === 0) {
			taskList = [];
		} else {
			taskList = JSON.parse(data);
		}
		taskStore.taskList = taskList;
		return taskStore;
	}
    

	async save() {
		await writeFile(this.filename, JSON.stringify(this.taskList), "utf8");
	}

	findTask(id) {
		for (const t of this.taskList) {
			if (t == null) { continue; }
			if (t["id"] === id) { return t; }
		}
		return null;
	}

	async add(taskName, priority, dueDate) {
		const time = new Date();
		const task = {
			"id": this.taskList.length + 1,
			"title": taskName,
			"priority": priority,
			"dueDate": dueDate,
			"createdAt": time.toISOString(),
			"completedAt": null
		};

		this.taskList.push(task);
		await this.save();
		this.emit("added", task, time);
	}

	*list() {
		for(const task of this.taskList) {
			if (task == null) {
				continue;
			}
			yield task
		}
	}

	async done(taskNumber) {
		if (!((taskNumber -1) in this.taskList)) {
			throw new Error(`${taskNumber} not found`);
		}
		const time = new Date();
		this.taskList[taskNumber-1]["completedAt"] = time;
		await this.save();
		this.emit("complete", this.taskList[taskNumber-1], time);
	}

	async delete(taskNumber) {
		if (! ((taskNumber - 1) in this.taskList)) {
			throw new Error(`${taskNumber} not found`);
		}
		const time = new Date();
		const task = this.taskList[taskNumber-1];
		delete this.taskList[taskNumber-1];
		await this.save();
		this.emit("remove", task, time); 
	}

	async update(id, newField) {
		const t = this.taskList[id-1];
		if (t == null) { return null; }
		for (const prop in newField) {
			if (t.hasOwnProperty(prop)) { t[prop] = newField[prop]; }
		}
		await this.save();
		return t;
	}

}