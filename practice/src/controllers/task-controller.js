function getTaskById(taskService) {
  return (req, res) => {
    res.status(200).json(taskService.getById(req.validated.params.id));
  };
}

function getTaskByQuery(taskService) {
  return (req, res) => {
    res.status(200).json(taskService.list(req.validated.query));
  };
}

function createTask(taskService) {
  return async (req, res) => {
    res.status(201).json(await taskService.create(req.validated.body));
  };
}

function modifyTask(taskService) {
  return async (req, res) => {
    res.status(200).json(await taskService.update(req.validated.params.id, req.validated.body));
  };
}

function deleteTask(taskService) {
  return async (req, res) => {
    await taskService.delete(req.validated.params.id);
    res.status(204).end();
  };
}

export {
  getTaskById,
  getTaskByQuery,
  createTask,
  modifyTask,
  deleteTask,
};
