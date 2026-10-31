import { faker } from "@faker-js/faker";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const USERS = 50;
const PROJECTS = 200;
const TASKS = 10_000;
const LABELS = ["urgent", "bug", "feature"];

// Xóa sạch và reset id về 1 → chạy lại bao nhiêu lần cũng không trùng
await prisma.$executeRaw`TRUNCATE users, projects, tasks, labels, task_labels, project_members, activities RESTART IDENTITY CASCADE`;

await prisma.user.createMany({
  data: Array.from({ length: USERS }, (_, i) => ({
    email: `user${i + 1}@example.com`,
    hashedPassword: "not-a-real-hash",
    name: faker.person.fullName()
  })),
});

// Sau RESTART IDENTITY, id chạy từ 1 nên tự tính được id mà không cần đọc lại
await prisma.project.createMany({
  data: Array.from({ length: PROJECTS }, (_, i) => ({
    name: faker.company.catchPhrase(),
    description: faker.lorem.sentence(),
    userId: (i % USERS) + 1,
  })),
});

await prisma.label.createMany({
  data: Array.from({ length: PROJECTS }, (_, p) =>
    LABELS.map((name) => ({ name, color: faker.color.rgb(), projectId: p + 1 })),
  ).flat(),
});

await prisma.task.createMany({
  data: Array.from({ length: TASKS }, (_, i) => {
    const status = faker.helpers.arrayElement(["todo", "in_progress", "done"] as const);
    return {
      title: faker.hacker.phrase().slice(0, 100),
      priority: faker.helpers.arrayElement(["low", "medium", "high"] as const),
      status,
      projectId: (i % PROJECTS) + 1,
      dueDate: faker.helpers.maybe(() => faker.date.soon({ days: 60 })) ?? null,
      completedAt: status === "done" ? faker.date.recent({ days: 30 }) : null,
    };
  }),
});

// Mỗi task gắn 0–2 label của chính project nó (label của project p có id (p-1)*3+1 .. +3)
await prisma.taskLabel.createMany({
  data: Array.from({ length: TASKS }, (_, i) => {
    const projectId = (i % PROJECTS) + 1;
    const picks = faker.helpers.arrayElements([0, 1, 2], { min: 0, max: 2 });
    return picks.map((k) => ({ taskId: i + 1, labelId: (projectId - 1) * LABELS.length + k + 1 }));
  }).flat(),
});

console.log("seeded:", {
  users: await prisma.user.count(),
  projects: await prisma.project.count(),
  tasks: await prisma.task.count(),
  labels: await prisma.label.count(),
  taskLabels: await prisma.taskLabel.count(),
});

await prisma.$disconnect();
