declare global {
  namespace Express {
    interface Request {
      actor?: { id: number, role: "admin" | "user"};
    }
  }
}
export {};
