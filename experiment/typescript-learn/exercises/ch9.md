# Bài tập TypeScript — Chương 9: Type Modifiers (Intermediate)

Bộ bài tập luyện kiến thức Chương 9 "Type Modifiers" của sách *Learning TypeScript* (Josh Goldberg). Mọi ví dụ đều mới, không lấy từ sách.

**Bối cảnh.** Bạn là lập trình viên của TicketGo, một nền tảng bán vé sự kiện. Hệ thống nhận dữ liệu từ nhiều nguồn không đáng tin: webhook của cổng thanh toán, file cấu hình do ban tổ chức tải lên, tham số trên URL, cache, thư viện cũ viết bằng JavaScript. Mỗi bài là một việc có thật: viết code theo đặc tả, sửa sự cố production, hoặc review một pull request.

**Đề không nói bạn phải dùng tính năng nào.** Đề chỉ nêu yêu cầu nghiệp vụ và tiêu chí nghiệm thu.

## Mục lục

- [Cách làm bài](#cách-làm-bài)
- [Bài 1 — Webhook thanh toán](#bài-1--webhook-thanh-toán)
- [Bài 2 — Sự cố: banner chào khách VIP](#bài-2--sự-cố-banner-chào-khách-vip)
- [Bài 3 — Sắp xếp bảng vé theo cột](#bài-3--sắp-xếp-bảng-vé-theo-cột)
- [Bài 4 — Cấu hình mặc định](#bài-4--cấu-hình-mặc-định)
- [Bài 5 — Tuỳ chọn biểu đồ và nhãn trạng thái](#bài-5--tuỳ-chọn-biểu-đồ-và-nhãn-trạng-thái)
- [Bài 6 — Sự cố: giữ ghế làm sập server](#bài-6--sự-cố-giữ-ghế-làm-sập-server)
- [Bài 7 — Pull request: ép kiểu khắp nơi](#bài-7--pull-request-ép-kiểu-khắp-nơi)
- [Bài 8 — Thông báo lỗi cho người dùng](#bài-8--thông-báo-lỗi-cho-người-dùng)
- [Bài 9 — Gỡ `any` khỏi hàm định dạng ô bảng](#bài-9--gỡ-any-khỏi-hàm-định-dạng-ô-bảng)
- [Bài 10 — Tổng hợp: nạp cấu hình sự kiện](#bài-10--tổng-hợp-nạp-cấu-hình-sự-kiện)
- [Gợi ý](#gợi-ý)
- [Đáp án và giải thích](#đáp-án-và-giải-thích)

## Cách làm bài

Bộ bài gồm 10 bài, làm trong khoảng 180 phút. Mọi đoạn code giả định bật `strict` trong `tsconfig.json`.

Mỗi bài viết code có tối đa ba phần:

- **Yêu cầu:** mô tả nghiệp vụ. Tên hàm và tên kiểu được cho sẵn để đoạn nghiệm thu chạy được; mọi thứ khác do bạn quyết định.
- **Nghiệm thu:** một đoạn code dùng lời giải của bạn, kèm kết quả phải in ra. Lời giải đúng khi đoạn này biên dịch được và in ra đúng từng dòng.
- **Phải bị chặn:** các dòng mà trình biên dịch phải báo lỗi. Nếu một dòng trong danh sách này biên dịch được thì lời giải chưa đạt.

Quy tắc chung:

- Không dùng `any`, `as` (trừ `as const`), toán tử `!`, hay `// @ts-ignore` trong lời giải của bạn. Chương này dạy chính những công cụ đó; bài tập yêu cầu bạn làm được việc mà không cần tới chúng.
- Mục [Gợi ý](#gợi-ý) có một dòng cho mỗi bài. Chỉ đọc khi đã thử ít nhất 10 phút mà chưa có hướng.
- Đáp án ở cuối file.

| Bài | Dạng | Thời gian gợi ý |
| --- | --- | --- |
| 1. Webhook thanh toán | Viết hàm | 20 phút |
| 2. Banner chào khách VIP | Điều tra sự cố | 15 phút |
| 3. Sắp xếp bảng vé | Viết hàm | 20 phút |
| 4. Cấu hình mặc định | Viết hàm | 15 phút |
| 5. Biểu đồ và nhãn trạng thái | Sửa lỗi và viết code | 15 phút |
| 6. Giữ ghế làm sập server | Điều tra sự cố | 15 phút |
| 7. Ép kiểu khắp nơi | Review pull request | 15 phút |
| 8. Thông báo lỗi | Viết hàm | 15 phút |
| 9. Gỡ `any` | Sửa code cũ | 10 phút |
| 10. Nạp cấu hình sự kiện | Tổng hợp | 40 phút |

## Bài 1 — Webhook thanh toán

Cổng thanh toán gọi về server của TicketGo mỗi khi một đơn hàng được thanh toán hoặc thất bại. Nội dung request là một chuỗi JSON. Phần lớn request đúng định dạng, nhưng log cho thấy thỉnh thoảng có request rác: thiếu trường, sai kiểu, hoặc không phải JSON.

**Yêu cầu.**

Một sự kiện thanh toán hợp lệ có đúng ba trường bắt buộc:

```ts
interface PaymentEvent {
  orderId: string;
  amount: number;
  status: "paid" | "failed";
}
```

Ngoài kiểu dữ liệu, `amount` phải lớn hơn 0. Trường thừa không làm sự kiện mất hợp lệ.

Viết hai hàm:

- `isPaymentEvent(value)` nhận một giá trị bất kỳ và cho biết nó có phải sự kiện thanh toán hợp lệ không. Sau khi kiểm tra trả về đúng, nơi gọi phải dùng được giá trị đó như một `PaymentEvent` mà không cần ép kiểu.
- `parseWebhook(body)` nhận chuỗi nội dung request, trả về `PaymentEvent` nếu hợp lệ, ngược lại trả về `null`. Hàm không bao giờ ném lỗi, kể cả khi chuỗi không phải JSON.

Ràng buộc:

- Quy tắc kiểm tra hình dạng chỉ viết ở một nơi.
- Không có giá trị kiểu `any` nào đi ra khỏi chỗ gọi `JSON.parse`.

**Nghiệm thu.**

```ts
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
```

**Phải bị chặn.**

```ts
const result = parseWebhook('{"orderId":"OD-1","amount":1,"status":"paid"}');
result.amount;

const something: unknown = JSON.parse("{}");
if (isPaymentEvent(something)) {
  something.status === "refunded";
}

parseWebhook(42);
```

## Bài 2 — Sự cố: banner chào khách VIP

Trang chủ hiển thị một banner tuỳ theo khách đang đăng nhập. Code đang chạy ổn:

```ts
interface Customer {
  id: string;
  name: string;
  tier: "standard" | "vip";
  points?: number;
}

function isLoyalCustomer(customer: Customer | undefined): customer is Customer {
  return customer !== undefined && customer.points !== undefined && customer.points >= 100;
}

function bannerFor(customer: Customer | undefined): string {
  if (isLoyalCustomer(customer)) {
    return `${customer.name} ơi, bạn có ${customer.points} điểm để đổi vé!`;
  }
  return "Đăng nhập để tích điểm";
}
```

Một lập trình viên mới được giao thêm lời chào cho khách VIP chưa đủ điểm. Anh ấy chèn ba dòng sau vào giữa hai lệnh `return`:

```ts
  if (customer !== undefined && customer.tier === "vip") {
    return `Chào khách VIP ${customer.name}`;
  }
```

Trình biên dịch báo `Property 'tier' does not exist on type 'never'`, và anh ấy không hiểu tại sao.

**Việc cần làm.**

1. Giải thích vì sao ở dòng mới, TypeScript cho rằng `customer` có kiểu `never`. Câu trả lời phải chỉ ra được dòng code nào gây ra kết luận đó.
2. Hàm `isLoyalCustomer` hứa hẹn điều gì với trình biên dịch, và lời hứa đó sai ở đâu?
3. Viết lại phần code này để có đúng hành vi dưới đây. Không dùng `as` hay `!`.

| Khách | Banner |
| --- | --- |
| Chưa đăng nhập | `Đăng nhập để tích điểm` |
| Có từ 100 điểm trở lên, bất kể hạng | `<tên> ơi, bạn có <điểm> điểm để đổi vé!` |
| Hạng VIP, dưới 100 điểm hoặc chưa có điểm | `Chào khách VIP <tên>` |
| Hạng thường, dưới 100 điểm hoặc chưa có điểm | `Đăng nhập để tích điểm` |

**Nghiệm thu.**

```ts
console.log(bannerFor({ id: "1", name: "An", tier: "standard", points: 250 }));  // An ơi, bạn có 250 điểm để đổi vé!
console.log(bannerFor({ id: "2", name: "Bình", tier: "vip", points: 40 }));      // Chào khách VIP Bình
console.log(bannerFor({ id: "3", name: "Chi", tier: "vip" }));                   // Chào khách VIP Chi
console.log(bannerFor({ id: "4", name: "Dũng", tier: "standard", points: 10 })); // Đăng nhập để tích điểm
console.log(bannerFor(undefined));                                               // Đăng nhập để tích điểm
```

## Bài 3 — Sắp xếp bảng vé theo cột

Trang quản trị có bảng thống kê vé. Người dùng bấm vào tiêu đề cột để sắp xếp; tên cột được đưa lên URL dạng `?sort=sold`, nên giá trị đó đến dưới dạng một chuỗi bất kỳ.

Dữ liệu và danh sách cột sắp xếp được đã có sẵn:

```ts
interface TicketRow {
  code: string;
  eventName: string;
  price: number;
  sold: number;
  remaining: number;
}

const SORTABLE_COLUMNS = {
  price: "Giá vé",
  sold: "Đã bán",
  remaining: "Còn lại",
};
```

**Yêu cầu.**

- `sortRows(rows, column, direction)` trả về một mảng mới đã sắp xếp theo `column`, tăng dần khi `direction` là `"asc"` và giảm dần khi là `"desc"`. Mảng gốc không bị thay đổi. `column` chỉ nhận các khoá của `SORTABLE_COLUMNS`.
- `sortFromQuery(rows, column)` nhận tên cột là một chuỗi bất kỳ từ URL. Nếu đó là cột sắp xếp được thì sắp xếp giảm dần; ngược lại trả về mảng gốc không đổi.
- `headerLabel(column)` trả về nhãn hiển thị của cột.

Ràng buộc:

- Danh sách cột sắp xếp được chỉ nằm ở một chỗ: object `SORTABLE_COLUMNS`. Không viết tay danh sách tên cột ở bất kỳ đâu khác, kể cả trong khai báo kiểu.
- Thêm một cột số mới của `TicketRow` vào `SORTABLE_COLUMNS` là đủ để cột đó sắp xếp được, không phải sửa chỗ nào khác.
- Nếu ai đó thêm vào `SORTABLE_COLUMNS` một khoá không phải cột số của `TicketRow`, ví dụ `eventName` hoặc `discount`, code phải không biên dịch được.

**Nghiệm thu.**

```ts
const rows: TicketRow[] = [
  { code: "A", eventName: "Hoà nhạc mùa thu", price: 800000, sold: 120, remaining: 30 },
  { code: "B", eventName: "Stand-up tối thứ Sáu", price: 250000, sold: 300, remaining: 0 },
  { code: "C", eventName: "Kịch Lôi Vũ", price: 400000, sold: 80, remaining: 70 },
];

console.log(sortRows(rows, "price", "asc").map((row) => row.code).join(""));       // BCA
console.log(sortFromQuery(rows, "sold").map((row) => row.code).join(""));          // BAC
console.log(sortFromQuery(rows, "eventName").map((row) => row.code).join(""));     // ABC
console.log(sortFromQuery(rows, "toString").map((row) => row.code).join(""));      // ABC
console.log(headerLabel("remaining"));                                             // Còn lại

// Với cột không sắp xếp được, phải trả về đúng mảng gốc chứ không phải một bản sao
console.log(sortFromQuery(rows, "eventName") === rows);   // true
console.log(sortFromQuery(rows, "toString") === rows);    // true
console.log(sortFromQuery(rows, "sold") === rows);        // false
```

**Phải bị chặn.**

```ts
sortRows(rows, "eventName", "asc");
sortRows(rows, "price", "up");

const fromUrl: string = "sold";
sortRows(rows, fromUrl, "asc");
```

**Câu hỏi.** Dòng nghiệm thu với `"toString"` tồn tại vì một cách kiểm tra rất tự nhiên lại cho kết quả sai với chuỗi này. Đó là cách nào, và vì sao nó sai?

## Bài 4 — Cấu hình mặc định

Cấu hình mặc định của ứng dụng là một object lớn, và mỗi môi trường (staging, production) tạo cấu hình của mình bằng cách sửa vài trường từ bản mặc định.

```ts
const DEFAULT_CONFIG = {
  apiBaseUrl: "https://api.ticketgo.test",
  timeoutMs: 5000,
  retry: { attempts: 3, backoffMs: 200 },
  features: { seatMap: true, waitlist: false },
};
```

**Yêu cầu.**

- Kiểu `AppConfig` mô tả một cấu hình đầy đủ, có cùng hình dạng với `DEFAULT_CONFIG`.
- Kiểu `FeatureName` là tên của một tính năng trong `features`.
- `withTimeout(config, timeoutMs)` trả về cấu hình mới với `timeoutMs` đã đổi.
- `enableFeature(config, feature)` trả về cấu hình mới với tính năng đó được bật.
- `isEnabled(config, feature)` cho biết tính năng có đang bật không.

Ràng buộc:

- `AppConfig` và `FeatureName` không được viết tay. Khi nhóm thêm một trường hoặc một tính năng mới vào `DEFAULT_CONFIG`, hai kiểu này tự cập nhật.
- Không hàm nào được thay đổi object cấu hình truyền vào.

**Nghiệm thu.**

```ts
const staging = enableFeature(withTimeout(DEFAULT_CONFIG, 15000), "waitlist");
console.log(staging.timeoutMs, isEnabled(staging, "waitlist"));          // 15000 true
console.log(DEFAULT_CONFIG.timeoutMs, isEnabled(DEFAULT_CONFIG, "waitlist"));  // 5000 false
```

**Phải bị chặn.**

```ts
withTimeout(DEFAULT_CONFIG, "15000");
enableFeature(DEFAULT_CONFIG, "darkMode");
const partial: AppConfig = { apiBaseUrl: "https://x.test", timeoutMs: 1000 };
const typo: AppConfig = { ...DEFAULT_CONFIG, retry: { attempts: 3, backoff: 200 } };
```

**Câu hỏi.** Một đồng nghiệp đề xuất thêm `as const` vào cuối `DEFAULT_CONFIG` "cho chắc ăn". Với lời giải của bạn, hàm nào sẽ không còn biên dịch được, và vì sao?

## Bài 5 — Tuỳ chọn biểu đồ và nhãn trạng thái

**Phần A — Lỗi khi tách biến.** Thư viện biểu đồ của nhóm có hàm sau:

```ts
interface ChartOptions {
  type: "line" | "bar";
  currency: "VND" | "USD";
  stacked: boolean;
}

function renderRevenueChart(options: ChartOptions): string {
  return `${options.type}/${options.currency}/${options.stacked}`;
}
```

Gọi trực tiếp thì chạy, nhưng khi một lập trình viên tách tuỳ chọn ra biến riêng để dùng lại thì bị lỗi:

```ts
renderRevenueChart({ type: "bar", currency: "VND", stacked: false });   // biên dịch được

const options = { type: "bar", currency: "VND", stacked: false };
renderRevenueChart(options);                                            // lỗi
```

1. Vì sao cùng một nội dung mà cách thứ hai bị lỗi?
2. Sửa dòng khai báo `options` theo hai cách khác nhau, mỗi cách chỉ sửa đúng dòng đó.
3. Giả sử có người gõ nhầm `"bars"` thay vì `"bar"`. Với mỗi cách sửa của bạn, lỗi được báo ở dòng nào? Cách nào bạn sẽ chọn cho code dùng chung, và vì sao?

**Phần B — Nhãn trạng thái đơn hàng.**

Giao diện cần hiển thị nhãn tiếng Việt cho trạng thái đơn hàng:

| Trạng thái | Nhãn |
| --- | --- |
| `pending` | Chờ thanh toán |
| `paid` | Đã thanh toán |
| `refunded` | Đã hoàn tiền |

Viết một object `STATUS_LABELS`, một kiểu `OrderStatus` và một hàm `labelOf(status)`.

- Danh sách trạng thái chỉ được viết ở một chỗ. Thêm một trạng thái mới chỉ cần thêm một dòng.
- Không code nào sửa được nhãn sau khi khai báo.

**Nghiệm thu.**

```ts
console.log(labelOf("paid"));   // Đã thanh toán
```

**Phải bị chặn.**

```ts
STATUS_LABELS.paid = "Xong";
labelOf("shipped");
const status: OrderStatus = "Đã thanh toán";
```

## Bài 6 — Sự cố: giữ ghế làm sập server

Đêm mở bán vé hoà nhạc, server khởi động lại liên tục. Log ghi `TypeError: Cannot read properties of undefined (reading 'status')`. Nguyên nhân: một bản cập nhật sơ đồ ghế đã xoá vài ghế, nhưng ứng dụng di động bản cũ vẫn gửi lên mã các ghế đó.

```ts
interface Seat {
  id: string;
  status: "free" | "held" | "sold";
  heldBy?: string;
}

interface User {
  id: string;
  name: string;
}

const seatMap = new Map<string, Seat>([
  ["A1", { id: "A1", status: "free" }],
  ["A2", { id: "A2", status: "held", heldBy: "u1" }],
  ["A3", { id: "A3", status: "held", heldBy: "u9" }],
  ["A4", { id: "A4", status: "sold" }],
]);

const users: User[] = [{ id: "u1", name: "Thu Hà" }];

function holdSeat(seatId: string, userId: string): string {
  const seat = seatMap.get(seatId)!;
  if (seat.status !== "free") {
    return `Ghế ${seat.id} không còn trống`;
  }
  seat.status = "held";
  seat.heldBy = userId;
  return `Đã giữ ghế ${seat.id}`;
}

function holderName(seatId: string): string {
  const seat = seatMap.get(seatId)!;
  const user = users.find((u) => u.id === seat.heldBy!)!;
  return user.name;
}
```

**Việc cần làm.**

1. Code này có bốn dấu `!`. Với mỗi dấu, mô tả một tình huống thật khiến lời khẳng định của nó sai.
2. Vì sao trình biên dịch không cảnh báo được tình huống nào trong số đó?
3. Viết lại hai hàm, bỏ hết dấu `!`, theo hành vi sau:

| Tình huống | Kết quả |
| --- | --- |
| Mã ghế không tồn tại (cả hai hàm) | `Không tìm thấy ghế <mã>` |
| `holderName`: ghế chưa có người giữ | `Ghế <mã> chưa có người giữ` |
| `holderName`: người giữ không có trong danh sách người dùng | `Không rõ người giữ` |

**Nghiệm thu.** Chạy theo đúng thứ tự.

```ts
console.log(holdSeat("A1", "u1"));   // Đã giữ ghế A1
console.log(holdSeat("A1", "u2"));   // Ghế A1 không còn trống
console.log(holdSeat("Z9", "u1"));   // Không tìm thấy ghế Z9
console.log(holderName("A1"));       // Thu Hà
console.log(holderName("A2"));       // Thu Hà
console.log(holderName("A3"));       // Không rõ người giữ
console.log(holderName("A4"));       // Ghế A4 chưa có người giữ
console.log(holderName("Z9"));       // Không tìm thấy ghế Z9
```

## Bài 7 — Pull request: ép kiểu khắp nơi

Một pull request mới qua CI xanh, nhưng khi chạy thử trên staging thì ba chỗ lần lượt hỏng. Đoạn liên quan:

```ts
interface Order {
  id: string;
  total: number;
  items: string[];
}

// (1) Tạo đơn nháp khi khách bắt đầu chọn vé
const draft = { id: "OD-9", total: 0 } as Order;
console.log(draft.items.length);

// (2) Đọc đơn hàng từ cache; dữ liệu trong cache do một service khác ghi
const cacheText = '{"id":"OD-1","total":"350000"}';
const fromCache = JSON.parse(cacheText) as Order;
console.log(fromCache.total.toFixed(0));

// (3) Số ghế lấy từ một ô nhập liệu
const seatCount = "12" as unknown as number;
console.log(seatCount.toFixed(1));
```

**Việc cần làm.**

1. Mỗi chỗ (1), (2), (3) hỏng thế nào lúc chạy?
2. CI dùng `tsc` với `strict` bật. Vì sao cả ba đều qua được?
3. Tác giả pull request ban đầu viết `"12" as number` ở chỗ (3) nhưng bị trình biên dịch từ chối, nên đổi sang `as unknown as number`. Lần từ chối đầu tiên đang cố nói với anh ấy điều gì?
4. Viết lại cả ba chỗ, không dùng `as`:
    - (1) đơn nháp là một `Order` hợp lệ với danh sách vé rỗng.
    - (2) viết `readCachedOrder(text)` trả về `Order` khi dữ liệu đúng hình dạng, ngược lại trả về `null`.
    - (3) số ghế là một số thật sự.

**Nghiệm thu.**

```ts
console.log(draft.items.length);                                                // 0
console.log(readCachedOrder('{"id":"OD-1","total":"350000"}'));                // null
console.log(readCachedOrder('{"id":"OD-1","total":350000,"items":["A1"]}'));  // { id: 'OD-1', total: 350000, items: [ 'A1' ] }
console.log(readCachedOrder("không phải JSON"));                              // null
console.log(seatCount.toFixed(1));                                              // 12.0
```

## Bài 8 — Thông báo lỗi cho người dùng

TicketGo gọi nhiều SDK của bên thứ ba. Mỗi SDK ném lỗi theo một kiểu: có cái ném `Error`, có cái ném chuỗi, có cái ném object tự chế. Màn hình lỗi đang hiển thị `undefined` hoặc `[object Object]`.

**Yêu cầu.** Viết `toErrorMessage(error)` nhận bất cứ thứ gì bị ném ra và trả về một chuỗi để hiển thị:

| Thứ bị ném | Kết quả |
| --- | --- |
| Một `Error` hoặc lớp con của `Error` | Nội dung `message` của nó |
| Một chuỗi | Chính chuỗi đó |
| Một object có `message` là chuỗi | Giá trị `message` đó |
| Một object không có `message` dạng chuỗi nhưng có `code` là số | `Mã lỗi <code>` |
| Mọi trường hợp khác | `Lỗi không xác định` |

Các dòng trong bảng được xét từ trên xuống; dòng đầu tiên khớp sẽ quyết định kết quả.

**Nghiệm thu.**

```ts
const throwers: (() => void)[] = [
  () => { throw new Error("Hết vé"); },
  () => { throw new TypeError("Sai kiểu dữ liệu"); },
  () => { throw "Phiên đăng nhập hết hạn"; },
  () => { throw { message: "Cổng thanh toán bận", retryAfter: 30 }; },
  () => { throw { code: 503 }; },
  () => { throw { message: 42 }; },
  () => { throw null; },
  () => { throw 404; },
];

for (const run of throwers) {
  try {
    run();
  } catch (error) {
    console.log(toErrorMessage(error));
  }
}
// Hết vé
// Sai kiểu dữ liệu
// Phiên đăng nhập hết hạn
// Cổng thanh toán bận
// Mã lỗi 503
// Lỗi không xác định
// Lỗi không xác định
// Lỗi không xác định
```

**Câu hỏi.**

1. Với `strict` bật, `catch (error) { console.log(error.message); }` không biên dịch được. Vì sao TypeScript chọn kiểu đó cho `error`?
2. Code cũ viết `(error as Error).message`. Với từng dòng trong `throwers`, cách đó cho ra kết quả gì?

## Bài 9 — Gỡ `any` khỏi hàm định dạng ô bảng

Hàm định dạng ô của bảng báo cáo được viết từ hồi dự án còn là JavaScript:

```ts
function formatCell(value: any): string {
  if (value === null || value === undefined) {
    return "—";
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "number") {
    return value.toFixed(0);
  }
  return value.trim();
}
```

**Việc cần làm.**

1. Với danh sách giá trị dưới đây, giá trị nào làm hàm ném lỗi lúc chạy?

```ts
const cells: unknown[] = [null, new Date("2026-12-24T19:30:00Z"), 1499999.6, "  Hoà nhạc  ", true, false, { seat: "A1" }, ["A1"]];
```

2. Đổi `any` thành `unknown` và không sửa gì khác. Trình biên dịch báo bao nhiêu lỗi, ở đâu? Vì sao những dòng còn lại không bị báo?
3. Sửa hàm theo hành vi: giá trị đúng/sai hiển thị `Có`/`Không`; chuỗi được cắt khoảng trắng hai đầu; mọi kiểu khác chưa được liệt kê trả về chuỗi rỗng. Các nhánh hiện có giữ nguyên.

**Nghiệm thu.**

```ts
console.log(cells.map(formatCell));
// [ '—', '2026-12-24', '1500000', 'Hoà nhạc', 'Có', 'Không', '', '' ]
```

## Bài 10 — Tổng hợp: nạp cấu hình sự kiện

Ban tổ chức tải lên một file JSON mô tả sự kiện và các hạng vé. File do con người viết tay nên thường sai. Bạn viết phần đọc và kiểm tra file này. Nếu file sai, ban tổ chức cần thấy **tất cả** lỗi cùng lúc để sửa một lần, chứ không phải sửa từng lỗi rồi tải lên lại.

Các hạng ghế và nhãn hiển thị đã có sẵn:

```ts
const SEAT_CLASSES = {
  standard: "Thường",
  vip: "VIP",
  box: "Hộp riêng",
} as const;
```

**Yêu cầu.**

Viết các kiểu sau:

- `SeatClass`: tên một hạng ghế. Không viết tay; thêm hạng ghế vào `SEAT_CLASSES` thì kiểu tự cập nhật.
- `PriceTier`: một hạng vé, gồm `seatClass`, `priceVnd`, `quantity`.
- `EventConfig`: gồm `id`, `title`, `startsAt` (đều là chuỗi) và `tiers` (danh sách hạng vé).
- `ParseResult`: hoặc `{ ok: true, config }` với `config` là một `EventConfig`, hoặc `{ ok: false, errors }` với `errors` là mảng chuỗi.

Viết `parseEventConfig(text)` trả về `ParseResult` theo quy tắc:

| Kiểm tra | Thông báo lỗi khi sai |
| --- | --- |
| Chuỗi là JSON hợp lệ | `JSON không hợp lệ` |
| Giá trị gốc là một object, không phải mảng hay `null` | `Cấu hình phải là một object` |
| `id` là chuỗi khác rỗng | `id phải là chuỗi khác rỗng` |
| `title` là chuỗi khác rỗng | `title phải là chuỗi khác rỗng` |
| `startsAt` là chuỗi | `startsAt phải là chuỗi` |
| `tiers` là mảng có ít nhất một phần tử | `tiers phải là mảng có ít nhất một phần tử` |
| Phần tử thứ `i` của `tiers` là object | `tiers[i] phải là object` |
| `seatClass` của phần tử đó là một hạng trong `SEAT_CLASSES` | `tiers[i].seatClass không hợp lệ` |
| `priceVnd` là số nguyên dương | `tiers[i].priceVnd phải là số nguyên dương` |
| `quantity` là số nguyên dương | `tiers[i].quantity phải là số nguyên dương` |

- Hai kiểm tra đầu tiên dừng ngay khi sai. Các kiểm tra còn lại được thực hiện hết và gom mọi lỗi theo đúng thứ tự trong bảng.
- Khi có lỗi, `ok` là `false`; khi không có lỗi nào, `ok` là `true`.

Viết `summarize(config)` trả về mảng dòng mô tả: dòng đầu `<title> (<startsAt>)`, mỗi hạng vé một dòng `<nhãn hạng ghế>: <quantity> vé, <priceVnd>đ`, dòng cuối `Tổng: <tổng số vé> vé`.

Ràng buộc:

- Không có giá trị nào trong code của bạn mang kiểu `any`. Rê chuột lên từng biến trong editor để kiểm tra; có một hàm có sẵn của JavaScript sẽ lặng lẽ đưa `any` vào nếu bạn không để ý.
- Không dùng `as` (trừ `as const` đã có sẵn) và không dùng `!`.

**Nghiệm thu.**

```ts
const good = `{
  "id": "EV-2026-12",
  "title": "Hoà nhạc Giáng sinh",
  "startsAt": "2026-12-24T19:30:00+07:00",
  "tiers": [
    { "seatClass": "vip", "priceVnd": 1500000, "quantity": 50 },
    { "seatClass": "standard", "priceVnd": 600000, "quantity": 400 }
  ]
}`;

const result = parseEventConfig(good);
if (result.ok) {
  console.log(summarize(result.config));
}
// [
//   'Hoà nhạc Giáng sinh (2026-12-24T19:30:00+07:00)',
//   'VIP: 50 vé, 1500000đ',
//   'Thường: 400 vé, 600000đ',
//   'Tổng: 450 vé'
// ]

const bad = `{
  "id": "",
  "startsAt": 20261224,
  "tiers": [
    { "seatClass": "toString", "priceVnd": 1500000, "quantity": 50 },
    { "seatClass": "box", "priceVnd": 2500000.5, "quantity": 0 },
    "vé đứng"
  ]
}`;
console.log(parseEventConfig(bad));
// {
//   ok: false,
//   errors: [
//     'id phải là chuỗi khác rỗng',
//     'title phải là chuỗi khác rỗng',
//     'startsAt phải là chuỗi',
//     'tiers[0].seatClass không hợp lệ',
//     'tiers[1].priceVnd phải là số nguyên dương',
//     'tiers[1].quantity phải là số nguyên dương',
//     'tiers[2] phải là object'
//   ]
// }

console.log(parseEventConfig("[]"));          // { ok: false, errors: [ 'Cấu hình phải là một object' ] }
console.log(parseEventConfig("{ id: 1 }"));   // { ok: false, errors: [ 'JSON không hợp lệ' ] }
console.log(parseEventConfig('{"id":"E","title":"T","startsAt":"x","tiers":[]}'));
// { ok: false, errors: [ 'tiers phải là mảng có ít nhất một phần tử' ] }
```

**Phải bị chặn.**

```ts
const parsed = parseEventConfig(good);
summarize(parsed.config);

if (!parsed.ok) {
  parsed.config;
}

SEAT_CLASSES.vip = "Hạng sang";
const tier: PriceTier = { seatClass: "balcony", priceVnd: 1, quantity: 1 };
```

**Câu hỏi.** Hàm có sẵn nào của JavaScript là thứ "lặng lẽ đưa `any` vào" nhắc tới trong ràng buộc? Nếu không để ý, hậu quả cụ thể với lời giải của bạn là gì?

## Gợi ý

Mỗi bài một dòng, chỉ nêu phần của chương nên đọc lại. Không có lời giải ở đây.

| Bài | Đọc lại mục |
| --- | --- |
| 1 | unknown; Type Predicates |
| 2 | Type Predicates, đoạn cảnh báo về nhánh `false` |
| 3 | keyof; keyof typeof |
| 4 | typeof; keyof typeof |
| 5 | Const Assertions; Literals to Primitives; Read-Only Objects |
| 6 | Non-Null Assertions; Type Assertion Caveats |
| 7 | Type Assertions; Assertions versus declarations; Assertion assignability |
| 8 | Asserting Caught Error Types; unknown |
| 9 | any, Again; unknown |
| 10 | Tất cả các mục trên |

## Đáp án và giải thích

Mọi lời giải dưới đây đã được biên dịch với `strict` bật và chạy ra đúng kết quả nghiệm thu. Lời giải của bạn có thể khác mà vẫn đúng, miễn là qua được Nghiệm thu, Phải bị chặn và các ràng buộc.

### Bài 1

```ts
function isPaymentEvent(value: unknown): value is PaymentEvent {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (!("orderId" in value) || typeof value.orderId !== "string") {
    return false;
  }
  if (!("amount" in value) || typeof value.amount !== "number" || value.amount <= 0) {
    return false;
  }
  if (!("status" in value) || (value.status !== "paid" && value.status !== "failed")) {
    return false;
  }
  return true;
}

function parseWebhook(body: string): PaymentEvent | null {
  let data: unknown;
  try {
    data = JSON.parse(body);
  } catch {
    return null;
  }
  return isPaymentEvent(data) ? data : null;
}
```

Các điểm chính:

- `JSON.parse` trả về `any`. Gán ngay vào một biến kiểu `unknown` là cách chặn `any` lan ra: từ đó trở đi, muốn dùng giá trị thì phải kiểm tra trước.
- `isPaymentEvent` khai báo kiểu trả về `value is PaymentEvent`, nên sau `if (isPaymentEvent(data))` trình biên dịch biết `data` là `PaymentEvent`. Cùng hàm đó dùng được làm đối số cho `filter`, và kết quả có kiểu `PaymentEvent[]`.
- Kiểm tra `typeof value !== "object" || value === null` là bắt buộc, vì `typeof null` cũng là `"object"`. Mảng `[1, 2]` qua được bước này nhưng bị loại ở bước kiểm tra `orderId`.

Lý do từng dòng trong "Phải bị chặn" bị chặn: `result` có thể là `null`; trong nhánh đã kiểm tra, `status` chỉ có thể là `"paid" | "failed"` nên so sánh với `"refunded"` là vô nghĩa; `parseWebhook` nhận chuỗi.

### Bài 2

1. Trong nhánh `false` của một type predicate, TypeScript loại kiểu được khẳng định ra khỏi kiểu ban đầu. `isLoyalCustomer` khẳng định `customer is Customer`, nên khi hàm trả về `false`, trình biên dịch kết luận `customer` không phải `Customer`, tức chỉ còn `undefined`. Sau `customer !== undefined`, không còn khả năng nào, nên kiểu là `never`. Kết luận này đến từ dòng `if (isLoyalCustomer(customer))`.
2. Kiểu `customer is Customer` hứa: "trả về `true` khi và chỉ khi đây là một `Customer`". Nhưng hàm trả về `false` cả với những khách có thật mà chưa đủ 100 điểm. Hàm kiểm tra nhiều hơn kiểu dữ liệu, nên nhánh `false` mang thông tin sai.
3. Một lời giải: tách việc "có khách hay không" ra khỏi việc "khách có đủ điểm không", và để hàm kiểm tra điểm trả về `boolean` bình thường.

```ts
function loyaltyPoints(customer: Customer): number {
  return customer.points === undefined ? 0 : customer.points;
}

function isLoyal(customer: Customer): boolean {
  return loyaltyPoints(customer) >= 100;
}

function bannerFor(customer: Customer | undefined): string {
  if (customer === undefined) {
    return "Đăng nhập để tích điểm";
  }
  if (isLoyal(customer)) {
    return `${customer.name} ơi, bạn có ${loyaltyPoints(customer)} điểm để đổi vé!`;
  }
  if (customer.tier === "vip") {
    return `Chào khách VIP ${customer.name}`;
  }
  return "Đăng nhập để tích điểm";
}
```

Bài học: type predicate chỉ nên kiểm tra đúng điều mà kiểu của nó khẳng định. Điều kiện nghiệp vụ như "đủ 100 điểm" thuộc về một hàm trả về `boolean`.

### Bài 3

```ts
type SortableColumn = keyof typeof SORTABLE_COLUMNS;

function sortRows(rows: TicketRow[], column: SortableColumn, direction: "asc" | "desc"): TicketRow[] {
  const copy = [...rows];
  copy.sort((a, b) => (direction === "asc" ? a[column] - b[column] : b[column] - a[column]));
  return copy;
}

function isSortableColumn(value: string): value is SortableColumn {
  return Object.keys(SORTABLE_COLUMNS).includes(value);
}

function sortFromQuery(rows: TicketRow[], column: string): TicketRow[] {
  return isSortableColumn(column) ? sortRows(rows, column, "desc") : rows;
}

function headerLabel(column: SortableColumn): string {
  return SORTABLE_COLUMNS[column];
}
```

Các ràng buộc được đáp ứng thế nào:

- `keyof typeof SORTABLE_COLUMNS` lấy tên cột từ chính object, nên không có danh sách nào viết tay.
- Thêm khoá `eventName` vào `SORTABLE_COLUMNS` thì `a[column]` có thể là chuỗi, và phép trừ trong `sortRows` không biên dịch được. Thêm khoá `discount` không có trong `TicketRow` thì `a[column]` không truy cập được. Cả hai trường hợp đều bị chặn mà không cần viết thêm kiểm tra nào.
- `[...rows]` tạo bản sao trước khi sắp xếp, vì `sort` sắp xếp ngay trên mảng gốc.

Câu hỏi: cách tự nhiên là `value in SORTABLE_COLUMNS`. Toán tử `in` kiểm tra cả các thuộc tính kế thừa từ prototype, và mọi object thường đều kế thừa `toString`, nên `"toString" in SORTABLE_COLUMNS` là `true`. Khi đó `sortFromQuery` coi `"toString"` là cột hợp lệ và gọi `sortRows`: `a[column]` là một hàm, phép trừ ra `NaN`, và hàm trả về một bản sao "sắp xếp" vô nghĩa thay vì mảng gốc. Thứ tự in ra tình cờ vẫn là `ABC`, nên lỗi chỉ lộ ra ở dòng nghiệm thu so sánh `=== rows`. `Object.keys` chỉ trả về các khoá của chính object nên không mắc lỗi này. Đây cũng là ví dụ cho thấy một type predicate viết sai sẽ khiến trình biên dịch tin một điều sai.

### Bài 4

```ts
type AppConfig = typeof DEFAULT_CONFIG;
type FeatureName = keyof typeof DEFAULT_CONFIG.features;

function withTimeout(config: AppConfig, timeoutMs: number): AppConfig {
  return { ...config, timeoutMs };
}

function enableFeature(config: AppConfig, feature: FeatureName): AppConfig {
  return { ...config, features: { ...config.features, [feature]: true } };
}

function isEnabled(config: AppConfig, feature: FeatureName): boolean {
  return config.features[feature];
}
```

`typeof` dùng được cả trên một thuộc tính lồng như `DEFAULT_CONFIG.features`. Các hàm dùng cú pháp spread để tạo object mới, nên `DEFAULT_CONFIG` không bị đổi.

Lý do từng dòng bị chặn: `timeoutMs` là số; `"darkMode"` không phải khoá của `features`; `partial` thiếu `retry` và `features`; `backoff` là thuộc tính thừa và trình biên dịch còn gợi ý tên đúng `backoffMs`.

Câu hỏi: `withTimeout` không biên dịch được. Với `as const`, `typeof DEFAULT_CONFIG` có `timeoutMs` mang kiểu literal `5000` thay vì `number`, nên mọi cấu hình có timeout khác 5000 đều không còn là `AppConfig`. `as const` biến object thành "giá trị này và chỉ giá trị này", trái với mục đích của một bản mặc định để sửa.

### Bài 5

**Phần A.**

1. Khi khai báo biến từ một object literal, TypeScript nới kiểu chuỗi thành `string` vì thuộc tính của object có thể bị gán lại. `options.type` có kiểu `string`, không gán được vào `"line" | "bar"`. Khi viết object trực tiếp trong lời gọi, TypeScript biết kiểu cần có nên giữ nguyên literal.
2. Hai cách sửa:

```ts
// Cách 1: chú thích kiểu
const options: ChartOptions = { type: "bar", currency: "VND", stacked: false };

// Cách 2: const assertion
const options = { type: "bar", currency: "VND", stacked: false } as const;
```

3. Với cách 1, lỗi `"bars"` được báo ngay tại dòng khai báo, kèm gợi ý `Did you mean '"bar"'?`. Với cách 2, dòng khai báo hợp lệ và lỗi chỉ hiện ở chỗ gọi `renderRevenueChart`, có thể cách xa nơi gõ nhầm. Với code dùng chung, cách 1 tốt hơn vì nó cho biết ý định ngay từ đầu. Cách 2 hợp với những hằng số không gắn với một kiểu có sẵn.

**Phần B.**

```ts
const STATUS_LABELS = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  refunded: "Đã hoàn tiền",
} as const;

type OrderStatus = keyof typeof STATUS_LABELS;

function labelOf(status: OrderStatus): string {
  return STATUS_LABELS[status];
}
```

`as const` làm mọi thuộc tính thành `readonly`, nên `STATUS_LABELS.paid = "Xong"` bị chặn. `OrderStatus` lấy từ khoá của object nên danh sách trạng thái chỉ nằm ở một chỗ. Dòng cuối trong "Phải bị chặn" cho thấy `OrderStatus` là tên trạng thái, không phải nhãn hiển thị.

### Bài 6

1. Bốn dấu `!`:
    - `seatMap.get(seatId)!` trong `holdSeat`: mã ghế đã bị xoá khỏi sơ đồ, đúng tình huống đêm mở bán.
    - `seatMap.get(seatId)!` trong `holderName`: cùng lý do.
    - `seat.heldBy!`: ghế còn trống hoặc đã bán, chưa từng có người giữ.
    - `users.find(...)!`: người giữ ghế đã xoá tài khoản, hoặc danh sách người dùng chưa tải xong.
2. `!` là một lời khẳng định của người viết, không phải một phép kiểm tra. Trình biên dịch tin nó và gỡ `undefined` khỏi kiểu; lúc biên dịch không có cách nào biết `Map` chứa những khoá nào khi chạy.
3. Lời giải:

```ts
function holdSeat(seatId: string, userId: string): string {
  const seat = seatMap.get(seatId);
  if (seat === undefined) {
    return `Không tìm thấy ghế ${seatId}`;
  }
  if (seat.status !== "free") {
    return `Ghế ${seat.id} không còn trống`;
  }
  seat.status = "held";
  seat.heldBy = userId;
  return `Đã giữ ghế ${seat.id}`;
}

function holderName(seatId: string): string {
  const seat = seatMap.get(seatId);
  if (seat === undefined) {
    return `Không tìm thấy ghế ${seatId}`;
  }
  const holderId = seat.heldBy;
  if (holderId === undefined) {
    return `Ghế ${seat.id} chưa có người giữ`;
  }
  const user = users.find((candidate) => candidate.id === holderId);
  if (user === undefined) {
    return "Không rõ người giữ";
  }
  return user.name;
}
```

Chi tiết đáng chú ý: `seat.heldBy` được chép ra biến `holderId` trước khi dùng trong callback của `find`. Kết quả thu hẹp kiểu trên một thuộc tính không được giữ bên trong callback, vì trình biên dịch cho rằng callback có thể chạy sau khi thuộc tính đã bị đổi; với một biến `const` thì kết quả thu hẹp được giữ. Ở đây phép so sánh `===` vẫn biên dịch được kể cả khi không chép, nhưng nếu callback cần dùng giá trị như một `string` thì bắt buộc phải chép.

### Bài 7

1. Cách hỏng lúc chạy:
    - (1) `draft.items` là `undefined`, nên `.length` ném `TypeError`.
    - (2) `fromCache.total` là chuỗi `"350000"`, nên `.toFixed` không tồn tại và ném `TypeError`.
    - (3) `seatCount` vẫn là chuỗi `"12"`, cũng ném `TypeError` khi gọi `.toFixed`.
2. `as` bảo trình biên dịch tin người viết thay vì kiểm tra. Ở (1), `as Order` bỏ qua việc thiếu `items` mà một chú thích kiểu sẽ bắt được. Ở (2), `JSON.parse` trả về `any`, và `as` chỉ đổi nhãn kiểu, không kiểm tra dữ liệu. Ở (3), `as unknown` đi qua một kiểu chung nhất để lách luật.
3. TypeScript chỉ cho ép kiểu giữa hai kiểu có liên quan tới nhau. `string` và `number` không liên quan, nên lời từ chối đang nói: "việc này gần như chắc chắn là nhầm lẫn". Chuyển chuỗi thành số là việc phải làm lúc chạy, không phải việc đổi nhãn kiểu.
4. Lời giải:

```ts
const draft: Order = { id: "OD-9", total: 0, items: [] };

function isOrder(value: unknown): value is Order {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (!("id" in value) || typeof value.id !== "string") {
    return false;
  }
  if (!("total" in value) || typeof value.total !== "number") {
    return false;
  }
  if (!("items" in value) || !Array.isArray(value.items)) {
    return false;
  }
  for (const item of value.items) {
    if (typeof item !== "string") {
      return false;
    }
  }
  return true;
}

function readCachedOrder(text: string): Order | null {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  return isOrder(data) ? data : null;
}

const seatCount = Number("12");
```

### Bài 8

```ts
function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "object" && error !== null) {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
    if ("code" in error && typeof error.code === "number") {
      return `Mã lỗi ${error.code}`;
    }
  }
  return "Lỗi không xác định";
}
```

Câu hỏi:

1. JavaScript cho phép ném bất cứ giá trị nào, không chỉ `Error`, và trình biên dịch không biết đoạn code trong `try` có thể ném gì. Vì vậy với `strict` bật, `error` trong `catch` có kiểu `unknown`.
2. `(error as Error).message` cho ra: `Hết vé`, `Sai kiểu dữ liệu`, `undefined` (chuỗi không có `message`), `Cổng thanh toán bận`, `undefined`, `42`, rồi ném `TypeError` khi đọc `message` của `null`, và `undefined` với `404`. Cách này đúng với 3 trên 8 trường hợp, và ở trường hợp `null` thì chính khối `catch` lại làm sập chương trình.

### Bài 9

1. Bốn giá trị cuối làm hàm ném lỗi: `true`, `false`, `{ seat: "A1" }` và `["A1"]`. Chúng đều rơi xuống `value.trim()`, mà không giá trị nào trong số đó có method `trim`.
2. Đúng một lỗi, ở dòng `return value.trim();`. Các dòng trước đó đều nằm sau một phép kiểm tra (`=== null`, `instanceof Date`, `typeof === "number"`) đã thu hẹp `unknown` thành kiểu cụ thể. Dòng cuối không có phép kiểm tra nào, và đó chính là dòng gây lỗi lúc chạy: `unknown` chỉ ra đúng chỗ mà `any` đã che đi.
3. Lời giải:

```ts
function formatCell(value: unknown): string {
  if (value === null || value === undefined) {
    return "—";
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "number") {
    return value.toFixed(0);
  }
  if (typeof value === "boolean") {
    return value ? "Có" : "Không";
  }
  if (typeof value === "string") {
    return value.trim();
  }
  return "";
}
```

### Bài 10

```ts
type SeatClass = keyof typeof SEAT_CLASSES;

interface PriceTier {
  seatClass: SeatClass;
  priceVnd: number;
  quantity: number;
}

interface EventConfig {
  id: string;
  title: string;
  startsAt: string;
  tiers: PriceTier[];
}

type ParseResult = { ok: true; config: EventConfig } | { ok: false; errors: string[] };

function isSeatClass(value: unknown): value is SeatClass {
  return typeof value === "string" && Object.keys(SEAT_CLASSES).includes(value);
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function parseTier(raw: unknown, index: number, errors: string[]): PriceTier | null {
  const path = `tiers[${index}]`;
  if (typeof raw !== "object" || raw === null) {
    errors.push(`${path} phải là object`);
    return null;
  }
  const seatClass: unknown = "seatClass" in raw ? raw.seatClass : undefined;
  const priceVnd: unknown = "priceVnd" in raw ? raw.priceVnd : undefined;
  const quantity: unknown = "quantity" in raw ? raw.quantity : undefined;
  if (!isSeatClass(seatClass)) {
    errors.push(`${path}.seatClass không hợp lệ`);
  }
  if (!isPositiveInteger(priceVnd)) {
    errors.push(`${path}.priceVnd phải là số nguyên dương`);
  }
  if (!isPositiveInteger(quantity)) {
    errors.push(`${path}.quantity phải là số nguyên dương`);
  }
  if (isSeatClass(seatClass) && isPositiveInteger(priceVnd) && isPositiveInteger(quantity)) {
    return { seatClass, priceVnd, quantity };
  }
  return null;
}

function parseEventConfig(text: string): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, errors: ["JSON không hợp lệ"] };
  }
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return { ok: false, errors: ["Cấu hình phải là một object"] };
  }

  const errors: string[] = [];
  const id: unknown = "id" in data ? data.id : undefined;
  const title: unknown = "title" in data ? data.title : undefined;
  const startsAt: unknown = "startsAt" in data ? data.startsAt : undefined;
  const rawTiers: unknown = "tiers" in data ? data.tiers : undefined;

  if (!isNonEmptyString(id)) {
    errors.push("id phải là chuỗi khác rỗng");
  }
  if (!isNonEmptyString(title)) {
    errors.push("title phải là chuỗi khác rỗng");
  }
  if (typeof startsAt !== "string") {
    errors.push("startsAt phải là chuỗi");
  }

  const tiers: PriceTier[] = [];
  if (!Array.isArray(rawTiers) || rawTiers.length === 0) {
    errors.push("tiers phải là mảng có ít nhất một phần tử");
  } else {
    const items: unknown[] = rawTiers;
    items.forEach((raw, index) => {
      const tier = parseTier(raw, index, errors);
      if (tier !== null) {
        tiers.push(tier);
      }
    });
  }

  if (errors.length === 0 && isNonEmptyString(id) && isNonEmptyString(title) && typeof startsAt === "string") {
    return { ok: true, config: { id, title, startsAt, tiers } };
  }
  return { ok: false, errors };
}

function summarize(config: EventConfig): string[] {
  const lines: string[] = [`${config.title} (${config.startsAt})`];
  let total = 0;
  for (const tier of config.tiers) {
    lines.push(`${SEAT_CLASSES[tier.seatClass]}: ${tier.quantity} vé, ${tier.priceVnd}đ`);
    total += tier.quantity;
  }
  lines.push(`Tổng: ${total} vé`);
  return lines;
}
```

Các quyết định đáng chú ý:

- Mỗi trường được đọc ra một biến kiểu `unknown` trước, rồi mới kiểm tra. Nhờ vậy cùng một biến dùng được cho cả bước ghi lỗi lẫn bước dựng kết quả.
- Ở cuối hàm, điều kiện trả về `ok: true` lặp lại các type predicate thay vì chỉ kiểm tra `errors.length === 0`. Trình biên dịch không biết "mảng lỗi rỗng" nghĩa là các trường đều hợp lệ; lặp lại các predicate là cách nói điều đó với nó mà không cần `as`.
- `isSeatClass` dùng `Object.keys(...).includes(...)` vì cùng lý do với Bài 3. Dòng nghiệm thu có `"toString"` để bắt đúng lỗi đó.
- `ParseResult` là một discriminated union trên trường `ok`. Vì vậy `result.config` chỉ truy cập được sau khi đã kiểm tra `result.ok`, đúng như hai dòng đầu của "Phải bị chặn".

Câu hỏi: đó là `Array.isArray`. Khi đối số có kiểu `unknown`, nó thu hẹp thành `any[]`, nên mọi phần tử lấy ra từ mảng đều mang kiểu `any` và có thể bị dùng tuỳ ý mà không kiểm tra. Trong lời giải, dòng `const items: unknown[] = rawTiers;` đưa các phần tử về lại `unknown`. Nếu bỏ dòng này và viết `rawTiers.forEach((raw) => ...)`, `raw` sẽ là `any`; một lời giải viết thẳng `raw.priceVnd` ở đó vẫn biên dịch được dù chưa kiểm tra gì, và một phần tử là chuỗi `"vé đứng"` sẽ lọt qua mà không bị báo lỗi.

### Tự đánh giá

| Số bài đạt | Gợi ý |
| --- | --- |
| 9–10 | Nắm chắc chương, có thể sang Chương 10 |
| 6–8 | Làm lại các bài chưa đạt sau một ngày, không xem đáp án |
| Dưới 6 | Đọc lại chương theo bảng ở mục Gợi ý rồi làm lại từ Bài 1 |

Một bài được tính là đạt khi phần Nghiệm thu in ra đúng, mọi dòng trong "Phải bị chặn" đều bị trình biên dịch báo lỗi, và các ràng buộc được đáp ứng mà không cần xem đáp án.