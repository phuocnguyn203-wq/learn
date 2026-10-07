import { readFileSync } from "node:fs";
import { join } from "node:path";
const envContent = readFileSync(join(import.meta.dirname, "../.env"), "utf8").trim().split("\n");
const envVar = new Map(envContent.map(i => i.split("=")));

const apiKeyMiddleware = (req, res, next) => {
  if (req.path === "/health") { return next(); }
  const userKey = req.get("x-api-key");
  if (!userKey || envVar.get("API_KEY") !== userKey) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

export { apiKeyMiddleware };