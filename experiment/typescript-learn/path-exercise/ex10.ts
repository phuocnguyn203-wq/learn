
interface Task {
  projectId: number;
  status: "todo" | "in_progress" | "done";
  title: string;
  priority: "low" | "medium" | "high";
  dueDate: Date;
}

type Key = "status" | "priority" | "projectId";

function groupby<K extends Key>(items: Task[], key: K) {
  const result: {
    [k in Task[K]]?: Task[];
  } = {};

  for (const item of items) {
    const kind = item[key];
    (result[kind] ??= []).push(item);
  }
  return result;
}

const tasks: Task[] = [
  {
    projectId: 1,
    status: "todo",
    title: "Design the homepage UI",
    priority: "high",
    dueDate: new Date("2026-10-20"),
  },
  {
    projectId: 1,
    status: "in_progress",
    title: "Implement user authentication",
    priority: "high",
    dueDate: new Date("2026-10-18"),
  },
  {
    projectId: 1,
    status: "done",
    title: "Set up the project repository",
    priority: "low",
    dueDate: new Date("2026-10-10"),
  },
  {
    projectId: 2,
    status: "todo",
    title: "Write unit tests",
    priority: "medium",
    dueDate: new Date("2026-10-25"),
  },
  {
    projectId: 2,
    status: "in_progress",
    title: "Fix responsive layout issues",
    priority: "medium",
    dueDate: new Date("2026-10-16"),
  },
  {
    projectId: 2,
    status: "done",
    title: "Create database schema",
    priority: "high",
    dueDate: new Date("2026-10-12"),
  },
  {
    projectId: 3,
    status: "todo",
    title: "Write API documentation",
    priority: "low",
    dueDate: new Date("2026-10-30"),
  },
  {
    projectId: 3,
    status: "in_progress",
    title: "Integrate payment gateway",
    priority: "high",
    dueDate: new Date("2026-10-22"),
  },
];

// const groupTasks = groupby(tasks, "priority");

// console.log(groupTasks);

function paginate<T>(items: T[], page: number, limit: number) {
  const start = (page - 1) * limit;
  const end = page * limit;

  return {
    data: items.slice(start, end),
    meta: {
      limit, page
    }
  }
}

const page = paginate(tasks, 1, 10);
console.log(page.data[0].title);

function parseTaskId(input: string) {
  const numberInput = Number(input);
  if (! Number.isInteger(numberInput)) {
    return {
      ok: false
    }
  }
  return {
    data: numberInput,
    ok: true
  };
}
