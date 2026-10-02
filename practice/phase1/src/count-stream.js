import { createReadStream } from "node:fs"
import { performance } from "perf_hooks"
import readline from "node:readline"

let [todo, inProgress, done] = [0, 0, 0]
const oneMillionReadable = createReadStream("./tasks.csv")

const rl = readline.createInterface({ input: oneMillionReadable })
const memoryUsagesInMb = []
const timer = setInterval(() => {
  const memoryInMb = process.memoryUsage().rss / (1024 * 1024)
  memoryUsagesInMb.push(memoryInMb)
}, 50)
const start = performance.now()
for await(const line of rl) {
  let [, ,status ,] = line.split(",")
  if (status === "status") { continue }
  switch (status) {
    case "todo":
      todo++
      break
    case "in_progress":
      inProgress++
      break
    case "done":
      done++
      break
    default:
      throw new Error(`not valid ${status}`)
  }
}
const timeElapsed = (performance.now() - start)
clearInterval(timer)


console.log(`Todo: ${todo}\nIn Progress: ${inProgress}\nDone: ${done}`)
const peakUsage = memoryUsagesInMb.reduce((acc, val) => acc > val ? acc : val)
console.log(`Time executed: ${timeElapsed.toFixed(2)} (ms)\nPeak memory usage: ${peakUsage} (Mb)`)