interface ChartOptions {
  type: "line" | "bar";
  currency: "VND" | "USD";
  stacked: boolean;
}

function renderRevenueChart(options: ChartOptions): string {
  return `${options.type}/${options.currency}/${options.stacked}`;
}

const options: ChartOptions = { type: "bar", currency: "VND", stacked: false };
renderRevenueChart(options);

type OrderStatus = "pending" | "paid" | "refunded";

const STATUS_LABELS = {
  "pending": "Chờ thanh toán",
  "paid": "Đã thanh toán",
  "refunded": "Đã hoàn tiền"
} as const;

function labelOf(status: OrderStatus) {
  return STATUS_LABELS[status];
}

console.log(labelOf("paid"));   // Đã thanh toán

