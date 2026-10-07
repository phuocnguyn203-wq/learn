function getAllProject(projectService) {
  return (_req, res) => {
    res.status(200).json(projectService.list());
  };
}

function getProjectById(projectService) {
  return (req, res) => {
    res.status(200).json(projectService.getById(req.validated.params.id));
  };
}

function createProject(projectService) {
  return async (req, res) => {
    res.status(201).json(await projectService.create(req.validated.body));
  };
}

function modifyProject(projectService) {
  return async (req, res) => {
    res.status(200).json(await projectService.update(req.validated.params.id, req.validated.body));
  };
}

function deleteProject(projectService) {
  return async (req, res) => {
    await projectService.delete(req.validated.params.id);
    res.status(204).end();
  };
}

export {
  getAllProject,
  getProjectById,
  createProject,
  modifyProject,
  deleteProject,
};
