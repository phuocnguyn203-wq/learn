import { createWriteStream } from "node:fs";
import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";
import { once } from "node:events"

const oneMillionTask = createWriteStream("./tasks.csv")
oneMillionTask.on("finish", () => console.log("Finish 1m rows"));

oneMillionTask.write("id,title,status,createdAt\n")
const STATUS = ["done", "todo", "in_progress"];
for(let i = 0; i < 1_000_000; i++) {
  const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] })
  const randomStatus = STATUS[Math.floor(Math.random() * STATUS.length)]
  const createdAt = (new Date()).toISOString()
  const shouldContinue = oneMillionTask.write(`${i+1},Task ${randomName},${randomStatus},${createdAt}\n`)
  if (!shouldContinue) {
    await once(oneMillionTask, "drain")
  }
}

oneMillionTask.end()