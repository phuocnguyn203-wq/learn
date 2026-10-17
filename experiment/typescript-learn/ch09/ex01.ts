interface PaymentEvent {
  orderId: string;
  amount: number;
  status: "paid" | "failed";
}

//predicate function
function isPaymentEvent(input: unknown): input is PaymentEvent {
  if (typeof input !== "object" || input === null) { return false; }
  const obj = input as Record<string, unknown>;
  
  return (
    typeof obj.orderId === "string" &&
    typeof obj.amount === "number" &&
    obj.amount > 0 &&
    (obj.status === "paid" || obj.status  === "failed")
  );
}

function parseWebhook(body: string) {
  try {
    const dataJson = JSON.parse(body);
    if (isPaymentEvent(dataJson)) { return dataJson; }
    return null;
  } catch {
    return null;
  }
}

console.log(parseWebhook('{"orderId":"OD-1","amount":350000,"status":"paid"}'));
// { orderId: 'OD-1', amount: 350000, status: 'paid' }
console.log(parseWebhook('{"orderId":"OD-2","amount":"350000","status":"paid"}'));   // null
console.log(parseWebhook('{"orderId":"OD-3","amount":350000,"status":"refunded"}')); // null
console.log(parseWebhook('{"orderId":"OD-4","amount":-1,"status":"failed"}'));       // null
console.log(parseWebhook("null"));       // null
console.log(parseWebhook("[1, 2]"));     // null
console.log(parseWebhook("xin chào"));   // null

const batch: unknown[] = [
  { orderId: "OD-5", amount: 120000, status: "paid" },
  { orderId: "OD-6" },
  "OD-7",
  { orderId: "OD-8", amount: 90000, status: "failed" },
];
const valid = batch.filter(isPaymentEvent);
console.log(valid.map((event) => `${event.orderId}:${event.status}`));
// [ 'OD-5:paid', 'OD-8:failed' ]

// const result = parseWebhook('{"orderId":"OD-1","amount":1,"status":"paid"}');
// result.amount;

// const something: unknown = JSON.parse("{}");
// if (isPaymentEvent(something)) {
//   something.status === "refunded";
// }

// parseWebhook(42);

