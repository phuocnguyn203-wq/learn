interface Order {
  id: string;
  total: number;
  items: string[];
}

const draft = { id: "OD-9", total: 0, items: [] } as Order;

function readCachedOrder(text: string): Order | null {
  try {
    const order = JSON.parse(text);
    return (
      typeof order["id"] === "string" &&
      typeof order["total"] === "number" &&
      Array.isArray(order["items"]) &&
      typeof order["items"][0] === "string"
    ) ? order : null;
  } catch {
    return null;
  }
}

const seatCount = 12;

console.log(draft.items.length);                                                // 0
console.log(readCachedOrder('{"id":"OD-1","total":"350000"}'));                // null
console.log(readCachedOrder('{"id":"OD-1","total":350000,"items":["A1"]}'));  // { id: 'OD-1', total: 350000, items: [ 'A1' ] }
console.log(readCachedOrder("không phải JSON"));                              // null
console.log(seatCount.toFixed(1));                                              // 12.0
