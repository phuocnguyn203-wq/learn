import { join } from "node:path";
import createApp from "./app.js";
import { taskService, projectService } from "./container.js";

process.loadEnvFile(join(import.meta.dirname, ".env"));

const port = 3000;
const app = createApp({ taskService, projectService });

app.listen(port, () => console.log(`server is listening on port ${port}`));
