import { performance } from "node:perf_hooks";
const requestLoggerMiddleware = (req, res, next) => {
  const method = req.method;
  const path = req.path;
  const startInMs = performance.now();
  res.on("finish", () => {
    const timeElapsedInMs = performance.now() - startInMs
    console.log(`${method} ${path} ${res.statusCode} ${timeElapsedInMs.toFixed(2)} (ms)`);
  })
  next();
}

export { requestLoggerMiddleware };
