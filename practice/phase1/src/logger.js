import { time } from "node:console";
import { appendFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const FILENAME = fileURLToPath(
    new URL("../activity.log", import.meta.url)
);
export default function register(taskStore) {
    taskStore.on("added", async (task, time) => {
        const loggedContent = `[${time}] added     #${task.id} "${task.title}"\n`;
        await appendFile(FILENAME, loggedContent, "utf8");
    });

    taskStore.on("complete", async (task, time) => {
        const loggedContent = `[${time}] completed #${task.id} "${task.title}"\n`;
        await appendFile(FILENAME, loggedContent, "utf8");
    });

    taskStore.on("remove", async (task, time) => {
        const loggedContent = `[${time}] deleted   #${task.id} "${task.title}"\n`;
        await appendFile(FILENAME, loggedContent, "utf8");
    });
}