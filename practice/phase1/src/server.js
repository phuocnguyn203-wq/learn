import { createServer } from "http"
import TaskStore from "./task-store.js"

const taskStore = await TaskStore.create("../data/task.json")
taskStore.on("added", (task, time) => {
  const returnedTask = { time, ...task }
  res.writeHead(201, { "Content-Type": "application/json" })
  res.end(JSON.stringify(returnedTask))
})
const server = createServer((req, res) => {
  const url = new URL(req.url, "http://localhost:3000")
  
  if (req.method === "GET") {
    switch (true) {
      case /^\/tasks$/.test(url.pathname): {
        res.writeHead(200, { "Content-Type": "application/json" })
        const tasks = taskStore.list()
        res.write("[")
        let first = true
        for(const task of tasks) {
          if (!first) { res.write(",") }
          if (first) { first = false }
          res.write(`${JSON.stringify(task)}`)          
        }
        res.end("]")
        break
      }

      case /^\/tasks\/\d+$/.test(url.pathname): {
        const id = Number.parseInt(url.pathname.slice("/tasks/".length))
        let task
        for (const t of taskStore.taskList) {
          if (t == null) { continue }
          if (t["id"] == id) { task = t; break; }
        }
        console.log(task)
        res.writeHead(200, { "Content-Type": "application/json" })
        res.write("[")
        res.write(task ? JSON.stringify(task) : "")
        res.end("]")
        break
      }
      default: {
        res.writeHead(404)
        res.end('{"error": "Route not found"}')
      }
    }
  } else if (req.method === "POST") {
    switch (true) {
      case /^\/tasks$/.test(url.pathname): {
        let body = ""
        req.on("data", chunk => {
          body += chunk
        })
        req.on("end", async () => {
          let obj
          try {
            obj = JSON.parse(body)
          } catch (err) {
            res.end('{"error": "Invalid JSON"}')
            return
          }
          const title = obj["title"]
          await taskStore.add(title)
        })
        break
      }
      default: {
        res.writeHead(404)
        res.end('{"error": "Route not found"}')
      }
    }
  }
})

server.listen(3000, () => console.log("Server is listening on 3000"))