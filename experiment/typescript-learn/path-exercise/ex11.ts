type TaskBase = {
  id: number;
  title: string;
}

type Task = 
  (TaskBase & { status: "todo" }) |
  (TaskBase & { status: "in_progress", startedAt: Date }) |
  (TaskBase & { status: "done", startedAt: Date, completedAt: Date })

function describeTask(task: Task) {
  switch(task.status) {
    case "todo": {
      return "Haven't started yet";
    }
    case "in_progress": {
      return `Started at ${task.startedAt}`;
    }
    case "done": {
      return `Finished at ${task.completedAt}`;
    }
  }
}
