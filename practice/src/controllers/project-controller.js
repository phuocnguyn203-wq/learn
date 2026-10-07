function getAllProject(projectStore) {
  return (_req, res) => {
    const projects = projectStore.fetchAllProjects();
    res.writeHead(200, { "Content-Type": "application/json"});
    res.write("[");
    let first = true;
    for (const p of projects) {
      if (first) {
        first = false;
      } else {
        res.write(",");
      }
      res.write(JSON.stringify(p));
    }
    res.end("]");
  }
}

function getProjectById(projectStore) {
  return (req, res) => {
    const p = projectStore.fetchProjectById(req.validated.params.id);
    if (p == null) { throw new NotFoundError("project not found"); }
    return res.status(200).json(JSON.stringify(p));
  }
}

function createProject(projectStore) {
  return async (req, res) => {
    const project = req.validated.body;
    const p = await projectStore.createProject(
      project["name"],
      project["description"],
    )
    return res.status(200).json(JSON.stringify(p));
  }
}

function modifyProject(projectStore) {
  return async (req, res) => {
    const result = await projectStore.updateProject(req.validated.params.id, req.validated.body);
    if (result == null) { throw new NotFoundError("project not found"); }
    return res.status(200).json(JSON.stringify(result));
  }
}

function deleteProject(projectStore) {
  return async (req, res) => {
    const result = await projectStore.deleteProject(req.validated.params.id);
    if (result == false) { throw new NotFoundError("project not found"); }
    return res.status(204).end();
  }
}

export {
  getAllProject,
  getProjectById,
  createProject,
  modifyProject,
  deleteProject,
};
