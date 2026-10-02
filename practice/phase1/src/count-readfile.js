import { readFile } from "node:fs"
import { performance } from "perf_hooks"

let [todo, inProgress, done] = [0, 0, 0]
const start = performance.now()
const memoryUsagesInMb = [process.memoryUsage().rss / (1024 * 1024)]
const timer = setInterval(() => {
  const memoryInMb = process.memoryUsage().rss / (1024 * 1024)
  memoryUsagesInMb.push(memoryInMb)
}, 50)
readFile("./tasks.csv", "utf8", (err, data) => {
  const lines = data.split("\n")
  for(const line of lines) {
    const [, , status, ] = line.split(",")
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
    }
  }
  clearInterval(timer)
  const timeElapsed = performance.now() - start

  console.log(`Todo: ${todo}\nIn Progress: ${inProgress}\nDone: ${done}`)
  const peakUsage = memoryUsagesInMb.reduce((acc, val) => acc > val ? acc : val)
  console.log(`Time executed: ${timeElapsed.toFixed(2)} (ms)\nPeak memory usage: ${peakUsage} (Mb)`)
})

