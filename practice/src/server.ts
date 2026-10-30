import createApp from "./app.js";
import { taskService, projectService } from "./container.js";

const port = 3000;
const app = createApp({ taskService, projectService });

app.listen(port, () => console.log(`server is listening on port ${port}`));
