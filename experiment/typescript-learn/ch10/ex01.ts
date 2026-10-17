function firstOrDefault<T>(items: T[], fallback: T): T {
  if (items.length === 0) {
    return fallback;
  }
  return items[0];
}

const u = firstOrDefault(["an", "binh"], "John");
const n = firstOrDefault([3, 5], 0);

// firstOrDefault([1, 2, 3], "none");
