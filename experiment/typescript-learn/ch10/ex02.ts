function zip<T, V>(as: T[], bs: V[]) {
  const results: [T, V][] = [];
  let idx = 0;
  while (as[idx] && bs[idx]) {
    results.push([as[idx], bs[idx]]);
    idx++;
  }
  return results;
}

const names = ["Ao", "Quan"];
const prices = [250_000, 400_000];
const rows = zip(names, prices);

const r0: [string, number] = rows[0];
