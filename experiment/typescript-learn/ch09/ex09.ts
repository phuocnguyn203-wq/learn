function formatCell(value: unknown): string {
  if (value == null) {
    return "-";
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "number") {
    return value.toFixed(0);
  }
  if (typeof value === "boolean") { return value ? "Đúng" : "Sai"}

  if (typeof value === "string") {
    return value.trim();
  } 
  return "";
}

const cells: unknown[] = [null, new Date("2026-12-24T19:30:00Z"), 1499999.6, "  Hoà nhạc  ", true, false, { seat: "A1" }, ["A1"]];
console.log(cells.map(formatCell));