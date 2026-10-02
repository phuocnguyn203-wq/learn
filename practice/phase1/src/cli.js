import TaskStore from "./task-store.js";
import { fileURLToPath } from "node:url";
import register from "./logger.js";

const command = process.argv[2];
const FILENAME = fileURLToPath(
    new URL("../data/task.json", import.meta.url)
);
const taskStore = await TaskStore.create(FILENAME);
const identifier = process.argv[3];
register(taskStore);
switch (command) {
    case (undefined): {
        console.log("Task Manager program:")
        console.log();
        console.log("add <taskName>");
        console.log("list");
        console.log("done <taskId>");
        console.log("delete <taskId>");
        break;
    }
    case "add": {
        if (identifier === undefined) {
            console.log("You forgot to specify task name");
            process.exit(1);
        }
        await taskStore.add(identifier);
        break;
    }
    case "list": {
        if (identifier !== undefined) {
            console.log(`list takes no argument`);
            process.exit(1);
        }
        for (const t of taskStore.list()) {
            const statusStr = t["completedAt"] ? "[X]" : "[ ]"
            const idStr = String(t["id"]).padStart(10, "-")
            const completedAtStr = t["completedAt"] ? t["completedAt"] : "-".padStart(24, "-")
            console.log(`${idStr} ${t["title"].padStart(20, "-")} ${statusStr} ${t["createdAt"]} ${completedAtStr}`)
        }
        break;
    }
    case "done": {
        if (identifier === undefined) {
            console.log("You forgot to specify take id");
            process.exit(1);
        }
        const taskId = Number(process.argv[3]);
        if (! Number.isInteger(taskId) || taskId <= 0) {
            console.log(`taskId must be positive integer given ${identifier} instead`);
            process.exit(1);
        }
        await taskStore.done(taskId);
        break;
    }
    case "delete": {
        if (identifier === undefined) {
            console.log("You forgot to specify take id");
            process.exit(1);
        }
        const taskId = Number(process.argv[3]);
        if (! Number.isInteger(taskId) || taskId <= 0) {
            console.log(`taskId must be positive integer given ${identifier} instead`);
            process.exit(1);
        }
        await taskStore.delete(taskId);
        break
    }
    default: {
        console.log("Not valid command");
        process.exit(1);
    }
};