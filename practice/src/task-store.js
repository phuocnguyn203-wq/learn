import { readFile, writeFile } from "node:fs/promises";
import EventEmitter from "node:events";
export default class TaskStore extends EventEmitter {
	constructor(filename) {
    super();
    this.filename = filename;
  }

	static async create(filename) {
		const taskStore = new TaskStore(filename);
		// TODO read file using Readble will be more efficient
		const data = await readFile(filename, "utf8");
		let tasks;
		if (data.length === 0) {
			tasks = [];
		} else {
			tasks = JSON.parse(data);
		}
		taskStore.tasks = tasks;
		return taskStore;
	}
    

	async save() {
		//TODO write file using Writable will be more efficient
		await writeFile(this.filename, JSON.stringify(this.tasks), "utf8");
	}

	getNewId() {
		const tasks = this.tasks;
		const taskLength = tasks.length;
		return tasks[taskLength-1] ? tasks[taskLength-1]["id"] + 1 : 1;
	}

	*fetchTaskById(id) {
		for (const t of this.tasks) {
			if (t == null) { continue; }
			if (t["id"] === id) { yield t; }
		}
	}
	
	//TODO implement latter
	fetchTaskByQuery(projectId, status=null, sort="-createdAt", page=1, limit=10) {
		let tasks = [];
		let isCompleted = (
			status === "done" ? true :
			status === "in_progress" ? false :
			null
		)
		const tasksByProjectId = [...this.fetchTaskByProjectId(projectId)];
		if (isCompleted == null) {
			tasks = tasksByProjectId;
		} else {
			for (const t of tasksByProjectId) {
				if (Boolean(t["status"]) === isCompleted) {
					tasks.push(t);
				}
			}	
		}
		const total = tasks.length;
		const totalPage = Math.ceil(total / limit);
		const start = (page-1) * limit;
		const end = page * limit;

		let sortFn;
		let sortKey;
		if (sort[0] === "-") {
			sortKey = sort.slice(1);
			switch (sort.slice(1)) {
				case "createdAt":
					sortFn = (a, b) => (new Date(b["createdAt"])) - (new Date(a["createdAt"]));
					break;
				case "dueDate":
					sortFn = (a, b) => (new Date(b["dueDate"])) - (new Date(a["dueDate"]));
					break;
			}	
		}else { 
			sortKey = sort;
			switch (sort) {
				case "createdAt":
					sortFn = (a, b) => (new Date(a["createdAt"])) - (new Date(b["createdAt"]));
					break;
				case "dueDate":
					sortFn = (a, b) => (new Date(a["dueDate"])) - (new Date(b["dueDate"]));
					break;
			}
		}
		tasks.sort(sortFn);	

		tasks = tasks.slice(start, end);
		return { tasks, total, totalPage};
	}

	*fetchTaskByProjectId(projectId) {
		for (const t of this.tasks) {
			if (t == null) { continue; }
			if (t["projectId"] === projectId) { yield t; }
		}
	}

	async add(projectId, taskName, priority, dueDate) {
		const time = new Date();
		const task = {
			"id": this.getNewId(),
			"projectId": projectId,
			"title": taskName,
			"priority": priority,
			"dueDate": (new Date(dueDate)).toISOString(),
			"createdAt": time.toISOString(),
			"completedAt": null
		};

		this.tasks.push(task);
		await this.save();
		this.emit("added", task, time);
	}

	*fetchAllTask() {
		yield* this.tasks;
	}

	async done(taskNumber) {
		const time = new Date();
		for (const t of this.tasks) {
			if (t["id"] === taskNumber) {
				t["completedAt"] = (new Date()).toString();
				await this.save();
				this.emit("complete", this.tasks[taskNumber-1], time);
				return true;
			}
		}
		return false;
	}

	async delete(taskNumber) {
		const time = new Date();
		for (const [idx, t] of Object.entries(this.tasks)) {
			if (t["id"] === taskNumber) {
				this.tasks.splice(idx, 1);
				await this.save();
				this.emit("remove", task, time);
				return true;		
			}
		}
		return false;
	}

	async update(id, newField) {
		let t = null;
		for (const task of this.tasks) {
			if (task["id"] === id) { t = task; }
		}
		if (t === null) { return null; }
		for (const prop in newField) {
			if (t.hasOwnProperty(prop)) { t[prop] = newField[prop]; }
		}
		await this.save();
		return t;
	}

}