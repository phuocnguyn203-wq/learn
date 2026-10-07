import { NotFoundError } from "../app-error.js";

function getTaskById(taskStore) {
  return (req, res) => {
    const id = req.validated.params.id;
    const task = taskStore.fetchTaskById(id);
    if (task === null) {
      throw new NotFoundError("Task not found");
    }
    res.writeHead(201, { "Content-Type": "application/json" });
    res.write(JSON.stringify(task));
    res.end();
  };
}

function getTaskByQuery(taskStore, projectStore) {
  return (req, res) => {
    const taskQuery = req.validated.query;
    if (!projectStore.checkIdExist(taskQuery["projectId"])) {
      throw new NotFoundError("project not found");
    }
    
    const { tasks, total, totalPage } = taskStore.fetchTaskByQuery(
      taskQuery["projectId"],
      taskQuery["status"],
      taskQuery["sort"],
      taskQuery["page"],
      taskQuery["limit"],
    );
    const result = {
      data: tasks,
      meta: {
        page: taskQuery["page"], 
        limit: taskQuery["limit"],
        total,
        totalPage,
      }
    }
    return res.status(200).json(result);
  };
}

function createTask(taskStore, projectStore) {
  return async (req, res) => {
    const t = req.validated.body;
    if (!projectStore.checkIdExist(t["projectId"])) {
      throw new NotFoundError("project not found");
    }
    await taskStore.add(t["projectId"], t["title"], t["priority"], t["dueDate"]);
    return res.status(201).end();
  };
}

function modifyTask(taskStore) {
  return async (req, res) => {
    const id = req.validated.params.id;
    const t = await taskStore.update(id, req.validated.body);
    if (t==null) { throw new NotFoundError("not found"); }
    return res.status(200).json(JSON.stringify(t));
  };
}

function deleteTask(taskStore) {
  return async (req, res) => {
    const id = req.validated.params.id;
    isDeleted = await taskStore.delete(id);
    res.status(204).end();
    
    if (!isDeleted) { throw new NotFoundError("not found"); }
  };
}

export {
  getTaskById,
  getTaskByQuery,
  createTask,
  modifyTask,
  deleteTask,  
};
