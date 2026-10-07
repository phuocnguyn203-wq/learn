const apiKeyMiddleware = (req, res, next) => {
  if (req.path === "/health") { return next(); }
  const userKey = req.get("x-api-key");
  if (!userKey || process.env.API_KEY !== userKey) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

export { apiKeyMiddleware };
