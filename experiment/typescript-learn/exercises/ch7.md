# Bài tập TypeScript — Chương 7: Interfaces (Intermediate)

Bộ bài tập luyện kiến thức Chương 7 "Interfaces" của sách *Learning TypeScript* (Josh Goldberg). Mọi ví dụ đều mới và lấy từ tình huống thường gặp trong dự án thật: dữ liệu trả về từ API, file cấu hình, biến môi trường, cổng thanh toán, bản dịch giao diện, giỏ hàng.

**Bối cảnh xuyên suốt.** Bạn vừa vào nhóm phát triển ShopNhanh, một sàn bán đặc sản trực tuyến. Mỗi bài là một việc bạn được giao trong tuần đầu: viết kiểu cho dữ liệu, review code của đồng nghiệp, hoặc tìm nguyên nhân một lỗi trên production.

## Mục lục

- [Cách làm bài](#cách-làm-bài)
- [Phần 1 — Interface cho dữ liệu: optional và readonly](#phần-1--interface-cho-dữ-liệu-optional-và-readonly)
- [Phần 2 — Hàm trong interface: method, property, call signature](#phần-2--hàm-trong-interface-method-property-call-signature)
- [Phần 3 — Index signatures](#phần-3--index-signatures)
- [Phần 4 — Interface lồng nhau và `extends`](#phần-4--interface-lồng-nhau-và-extends)
- [Phần 5 — Interface merging](#phần-5--interface-merging)
- [Phần 6 — Bài tổng hợp: module giỏ hàng](#phần-6--bài-tổng-hợp-module-giỏ-hàng)
- [Đáp án và giải thích](#đáp-án-và-giải-thích)

## Cách làm bài

Bộ bài gồm 14 bài, làm trong khoảng 130 phút. Mọi đoạn code giả định bật `strict` trong `tsconfig.json`.

- **Dự đoán trước, chạy sau.** Ghi câu trả lời ra giấy rồi mới dán code vào TypeScript Playground.
- **Phân biệt hai loại lỗi.** Nhiều bài có cả lỗi biên dịch lẫn lỗi chỉ xuất hiện lúc chạy. Với mỗi dòng, hãy nói rõ nó thuộc loại nào.
- **Không dùng `any`, `as` hay `// @ts-ignore`** để làm lỗi biến mất.
- Đáp án nằm ở cuối file.

| Phần | Chủ đề | Số bài | Thời gian gợi ý |
| --- | --- | --- | --- |
| 1 | Interface cho dữ liệu, optional, readonly | 3 | 25 phút |
| 2 | Method, property, call signature | 2 | 20 phút |
| 3 | Index signatures | 3 | 25 phút |
| 4 | Interface lồng nhau, `extends`, override | 3 | 20 phút |
| 5 | Interface merging | 2 | 15 phút |
| 6 | Bài tổng hợp | 1 | 30 phút |

## Phần 1 — Interface cho dữ liệu: optional và readonly

### Bài 1.1 — Viết kiểu cho một response của API

Backend trả về dữ liệu sau cho `GET /api/products/42`.

```json
{
  "id": 42,
  "sku": "TRA-01",
  "name": "Trà ô long 200g",
  "priceVnd": 185000,
  "status": "active",
  "seller": { "id": 7, "shopName": "Trà Đà Lạt", "verified": true },
  "tags": ["trà", "đặc sản"]
}
```

Tài liệu API ghi chú thêm hai điều:

- Trường `status` chỉ nhận một trong ba giá trị: `"active"` (đang bán), `"out_of_stock"` (hết hàng), `"hidden"` (đang ẩn).
- Trường `discountPercent` là một số, và chỉ xuất hiện khi sản phẩm đang giảm giá.

1. Viết kiểu `ProductStatus` cho trường `status`. Kiểu này viết bằng `interface` được không? Vì sao?
2. Viết interface `Product` cho cả object trên, và interface `Seller` cho object con nằm ở khoá `"seller"`. Trường `status` của `Product` dùng kiểu `ProductStatus`.
3. Với kiểu bạn vừa viết, dòng nào lỗi trong A–E? (`{ ...fromApi, id: "42" }` tạo một object mới giống `fromApi` nhưng thay `id` bằng `"42"`.)

```ts
const fromApi: Product = {
  id: 42, sku: "TRA-01", name: "Trà ô long 200g", priceVnd: 185000, status: "active",
  seller: { id: 7, shopName: "Trà Đà Lạt", verified: true },
  tags: ["trà", "đặc sản"],
};

const p1: Product = { ...fromApi, id: "42" };                                   // A
const p2: Product = { ...fromApi, seller: { id: 7, shopName: "Trà Đà Lạt" } };  // B
const p3: Product = { ...fromApi, discountPercent: null };                      // C
const p4: Product = { ...fromApi, status: "sold" };                             // D
const salePrice = fromApi.priceVnd * (1 - fromApi.discountPercent / 100);       // E
```

4. Sửa dòng E để tính đúng giá bán khi sản phẩm không giảm giá.

### Bài 1.2 — File cấu hình bị sửa lúc chạy

Tuần trước production gặp sự cố: một hàm tiện ích âm thầm đổi `timeoutMs` của cấu hình dùng chung, làm mọi request sau đó bị timeout sớm. Trưởng nhóm yêu cầu khoá cấu hình bằng `readonly`.

```ts
interface AppConfig {
  readonly apiBaseUrl: string;
  readonly timeoutMs: number;
  readonly allowedOrigins: string[];
  retries: number;
}

function tune(config: AppConfig) {
  config.retries += 1;                              // A
  config.timeoutMs = 10_000;                        // B
  config.allowedOrigins.push("https://evil.test");  // C
  config.allowedOrigins = [];                       // D
}

const raw = {
  apiBaseUrl: "https://api.shopnhanh.test",
  timeoutMs: 5000,
  allowedOrigins: ["https://shopnhanh.test"],
  retries: 2,
};

raw.apiBaseUrl = "http://localhost:3000";           // E
const config: AppConfig = raw;                      // F
config.apiBaseUrl = "https://staging.test";         // G
raw.timeoutMs = 1;                                  // H
console.log(config.timeoutMs);                      // in ra gì?
```

1. Dòng nào lỗi trong A–H?
2. Dòng C thêm được một origin lạ vào danh sách dù thuộc tính là `readonly`. `readonly` ở đây thật ra bảo vệ điều gì?
3. Dòng cuối in ra số nào? Từ đó, `readonly` có ngăn được sự cố tuần trước trong mọi trường hợp không?
4. Sau khi biên dịch sang JavaScript, từ khoá `readonly` còn lại gì?

### Bài 1.3 — Form cập nhật hồ sơ

Màn hình "Sửa hồ sơ" chỉ gửi lên những trường người dùng thật sự thay đổi. Một đồng nghiệp viết hàm ghi log thay đổi như sau.

```ts
interface UpdateProfileRequest {
  displayName?: string;
  phone?: string;
  birthYear?: number;
}

function buildChanges(req: UpdateProfileRequest): string[] {
  const changes: string[] = [];
  changes.push(`tên: ${req.displayName.trim()}`);                 // A
  if (req.phone) {
    changes.push(`sđt: ${req.phone.replace(" ", "")}`);           // B
  }
  if (req.birthYear !== undefined) {
    changes.push(`tuổi: ${2026 - req.birthYear}`);                // C
  }
  return changes;
}

buildChanges({});                               // D
buildChanges({ phone: "0901 234 567" });        // E
buildChanges({ phon: "0901" });                 // F
buildChanges({ birthYear: "1999" });            // G
```

1. Dòng nào lỗi trong A–G?
2. Dòng D hợp lệ dù object rỗng. Điều đó đúng với yêu cầu nghiệp vụ hay là một lỗ hổng?
3. Dòng F là lỗi gõ nhầm rất hay gặp. Nếu mọi thuộc tính đều tuỳ chọn, cơ chế nào của TypeScript vẫn bắt được nó?
4. Sửa dòng A.

## Phần 2 — Hàm trong interface: method, property, call signature

### Bài 2.1 — Hợp đồng cho cổng thanh toán

ShopNhanh sắp tích hợp nhiều cổng thanh toán. Nhóm thống nhất một interface chung để mỗi cổng tự cài đặt, và viết trước một cổng giả để chạy test.

```ts
interface PaymentGateway {
  readonly name: string;
  charge(amountVnd: number, orderId: string): boolean;
  refund: (orderId: string) => boolean;
  onSuccess?: (orderId: string) => void;
  ping?(): number;
}

const fake: PaymentGateway = {
  name: "FakePay",
  charge(amountVnd, orderId) {
    return amountVnd > 0 && orderId.length > 0;
  },
  refund: (orderId) => orderId.startsWith("DH"),
};

fake.charge(185000, "DH-1001");          // A
fake.charge("185000", "DH-1001");        // B
fake.onSuccess("DH-1001");               // C
fake.ping?.();                           // D
fake.name = "RealPay";                   // E
fake.refund = () => true;                // F

const broken: PaymentGateway = { name: "X", charge: () => "ok", refund: () => true };  // G
const noRefund: PaymentGateway = { name: "X", charge: () => true };                    // H
```

1. Trong interface, thành viên nào viết theo cú pháp method, thành viên nào theo cú pháp property?
2. Dòng nào lỗi trong A–H?
3. Trong `fake`, tham số `amountVnd` và `orderId` của `charge` không có chú thích kiểu. Vì sao TypeScript vẫn biết kiểu của chúng?
4. Một đồng nghiệp muốn cấm gán lại `charge` nên viết `readonly charge(amountVnd: number, orderId: string): boolean;`. Chuyện gì xảy ra? Viết lại thế nào để đạt được mục đích đó?

### Bài 2.2 — Logger vừa gọi được vừa có thuộc tính

Nhiều thư viện JavaScript xuất ra một hàm có gắn thêm thuộc tính, ví dụ một logger gọi trực tiếp được nhưng cũng mang cấu hình và bộ đếm. Nhóm muốn mô tả kiểu cho logger nội bộ.

```ts
interface Logger {
  (message: string): void;
  prefix: string;
  count: number;
}

function log(message: string) {
  log.count += 1;
  console.log(`${log.prefix} #${log.count} ${message}`);
}
log.prefix = "[shop]";
log.count = 0;

const logger: Logger = log;              // A
logger("Đơn DH-1001 đã thanh toán");     // B
logger(404);                             // C
logger.count = "nhiều";                  // D

function plain(message: string) {
  console.log(message);
}
const logger2: Logger = plain;           // E
const logger3: Logger = { prefix: "[x]", count: 0 };  // F
```

1. Dòng `(message: string): void;` trong interface gọi là gì? Nó khác cú pháp function type `(message: string) => void` ở ký tự nào?
2. Dòng nào lỗi trong A–F?
3. E và F mỗi dòng thiếu một nửa của `Logger`. Mỗi dòng thiếu nửa nào?
4. Hiện có kiểu `type Validator = (value: string) => string | null;` dùng để kiểm tra một ô nhập liệu. Viết interface `FieldValidator` tương đương, có thêm thuộc tính `fieldName: string`.

## Phần 3 — Index signatures

### Bài 3.1 — Bản dịch giao diện làm sập trang

Trang đơn hàng bị trắng màn hình với lỗi `Cannot read properties of undefined (reading 'toUpperCase')`. Code liên quan:

```ts
interface Translations {
  [key: string]: string;
}

const vi: Translations = {
  "cart.title": "Giỏ hàng",
  "cart.empty": "Chưa có sản phẩm",
};

vi["cart.checkout"] = "Thanh toán";                   // A
vi["cart.count"] = 3;                                 // B
const title = vi["cart.title"].toUpperCase();         // C
const heading = vi["order.title"].toUpperCase();      // D
```

1. Dòng nào bị lỗi biên dịch?
2. Dòng nào gây ra sự cố lúc chạy? Vì sao TypeScript không cảnh báo?
3. Đề xuất hai cách sửa kiểu để TypeScript buộc người viết phải xử lý trường hợp thiếu khoá: một cách vẫn dùng index signature, một cách dùng `Map`.
4. Với mỗi cách, viết lại dòng D sao cho khi thiếu bản dịch thì hiển thị chính tên khoá.

### Bài 3.2 — Biến môi trường

Nhóm muốn có kiểu cho biến môi trường của server: `NODE_ENV` và `PORT` bắt buộc phải có, các biến khác tuỳ từng môi trường triển khai.

```ts
interface EnvVars {
  NODE_ENV: "development" | "production";
  PORT: number;                 // A
  [key: string]: string;
}
```

1. Dòng A bị lỗi gì? Phát biểu quy tắc chung về thuộc tính có tên khi đứng cùng index signature.
2. Có hai cách sửa: đổi `PORT` thành `string`, hoặc nới index signature thành `string | number`. Trong thực tế mọi biến môi trường đều được đọc vào dưới dạng chuỗi. Cách nào phản ánh đúng dữ liệu hơn?
3. `NODE_ENV` có kiểu `"development" | "production"` chứ không phải `string`. Vì sao nó không vi phạm quy tắc ở câu 1?
4. Sau khi sửa `PORT` thành `string`, dòng nào lỗi trong B–G?

```ts
const env1: EnvVars = { NODE_ENV: "production", PORT: "8080", DATABASE_URL: "postgres://db" };  // B
const env2: EnvVars = { NODE_ENV: "staging", PORT: "8080" };                                    // C
const env3: EnvVars = { PORT: "8080", DATABASE_URL: "postgres://db" };                          // D
const env4: EnvVars = { NODE_ENV: "development", PORT: "3000", DEBUG: true };                   // E
const port: number = env1.PORT;                                                                 // F
const secretLength = env1.JWT_SECRET.length;                                                    // G
```

5. Dòng G không bị lỗi biên dịch. Chuyện gì xảy ra lúc chạy trên một máy chưa đặt `JWT_SECRET`?

### Bài 3.3 — Bảng thông báo theo mã HTTP

```ts
interface StatusMessages {
  [code: number]: string;
}

const messages: StatusMessages = {
  200: "OK",
  404: "Không tìm thấy",
  500: "Lỗi máy chủ",
};

messages[404];            // A
messages[201] = "Đã tạo"; // B
messages.notFound;        // C
messages["404"];          // D

const more: StatusMessages = { 200: "OK", ok: "OK" };  // E
```

1. Dòng nào lỗi trong A–E?
2. Dòng D dùng khoá là chuỗi nhưng vẫn hợp lệ. Điều này liên quan gì tới cách JavaScript xử lý khoá của object?
3. Trong hai interface sau, cái nào hợp lệ và vì sao?

```ts
interface First {
  [code: number]: string;
  [key: string]: string | undefined;
}

interface Second {
  [code: number]: string | undefined;
  [key: string]: string;
}
```

## Phần 4 — Interface lồng nhau và `extends`

### Bài 4.1 — Response chi tiết đơn hàng

Backend trả về dữ liệu sau cho `GET /api/orders/DH-1001`. Tài liệu API ghi: `note` trong địa chỉ có thể không có; `paidAt` luôn có mặt, là `null` khi đơn chưa thanh toán.

```json
{
  "id": "DH-1001",
  "customer": { "id": 9, "fullName": "Trần Thu Hà", "phone": "0901234567" },
  "shippingAddress": {
    "street": "12 Lý Thường Kiệt",
    "district": "Hoàn Kiếm",
    "city": "Hà Nội"
  },
  "items": [{ "sku": "TRA-01", "quantity": 2, "unitPriceVnd": 185000 }],
  "paidAt": null
}
```

1. Viết bốn interface `Address`, `Customer`, `OrderItem`, `Order`. Không viết kiểu lồng trực tiếp trong `Order`.
2. `note` và `paidAt` đều "có thể không có giá trị" nhưng phải khai báo theo hai cách khác nhau. Mỗi cái khai báo thế nào và vì sao?
3. Gọi `order` là object ở trên, đã được gán kiểu `Order`. Dòng nào lỗi trong A–F?

```ts
const a: Order = { ...order, shippingAddress: { street: "12 Lý Thường Kiệt", city: "Hà Nội" } };  // A
const b: Order = { ...order, items: [{ sku: "TRA-01", quantity: "2", unitPriceVnd: 185000 }] };   // B
const c: Order = { id: "DH-1004", customer: order.customer, shippingAddress: order.shippingAddress, items: [] };  // C

order.shippingAddress.note.length;     // D
order.paidAt.slice(0, 10);             // E
order.customer.email;                  // F
```

### Bài 4.2 — Gom phần trùng lặp

Ba bảng trong cơ sở dữ liệu đang có kiểu viết lặp lại nhiều trường:

```ts
interface Customer {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
  loyaltyPoints: number;
}

interface Seller {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  shopName: string;
}
```

1. Tách ra ba interface nền `Account` (`id`, `email`), `Timestamped` (`createdAt`, `updatedAt`), `SoftDeletable` (`deletedAt`), rồi viết lại `Customer` và `Seller` bằng `extends`.
2. Viết hai hàm `lastTouched(entity: Timestamped): string` và `isDeleted(entity: SoftDeletable): boolean`.
3. Với `customer: Customer` và `seller: Seller`, dòng nào lỗi trong A–G?

```ts
lastTouched(customer);   // A
lastTouched(seller);     // B
isDeleted(seller);       // C
isDeleted(customer);     // D

const s: Seller = { id: 1, email: "tra@shop.vn", shopName: "Trà Đà Lạt", createdAt: "2026-01-05", updatedAt: "2026-10-01" };  // E
const account: Account = seller;      // F
const asCustomer: Customer = seller;  // G
```

4. `lastTouched` không biết gì về `Customer` hay `Seller` nhưng nhận được cả hai. Lợi ích của việc khai báo tham số theo interface nhỏ nhất đủ dùng là gì?

### Bài 4.3 — Thu hẹp thuộc tính khi kế thừa

Hệ thống thanh toán phát ra sự kiện. Nhóm muốn có kiểu riêng cho từng loại sự kiện để hàm xử lý không phải kiểm tra `null` lặp đi lặp lại.

```ts
interface PaymentEvent {
  orderId: string;
  status: "pending" | "paid" | "failed";
  paidAt: string | null;
}

interface PaidEvent extends PaymentEvent {          // A
  status: "paid";
  paidAt: string;
}

interface RefundedEvent extends PaymentEvent {      // B
  status: "refunded";
}

interface TimedEvent extends PaymentEvent {         // C
  paidAt: Date | null;
}

interface FailedEvent extends PaymentEvent {        // D
  status: "failed";
  paidAt: null;
  reason: string;
}
```

1. Interface nào bị lỗi trong A–D? Phát biểu quy tắc về việc khai báo lại thuộc tính của interface cha.
2. Vì sao TypeScript phải áp quy tắc đó? Gợi ý: nghĩ tới một hàm nhận `PaymentEvent` nhưng được truyền vào một `RefundedEvent`.
3. Trong hai hàm sau, hàm nào lỗi? Điều đó cho thấy lợi ích gì của `PaidEvent`?

```ts
function receiptDate(event: PaidEvent) {
  return event.paidAt.slice(0, 10);
}

function anyDate(event: PaymentEvent) {
  return event.paidAt.slice(0, 10);
}
```

4. Muốn hỗ trợ trạng thái `"refunded"` thì phải sửa ở đâu?

## Phần 5 — Interface merging

### Bài 5.1 — Bổ sung kiểu cho thư viện

Một thư viện web framework khai báo kiểu cho ngữ cảnh của mỗi request. Middleware xác thực của nhóm bạn gắn thêm thông tin người dùng vào ngữ cảnh đó, và bạn cần TypeScript biết điều này mà không sửa file của thư viện.

```ts
// Khai báo của thư viện
interface RequestContext {
  requestId: string;
  path: string;
}

// Khai báo bổ sung của nhóm bạn
interface RequestContext {
  user?: { id: string; role: "admin" | "customer" };
}

function handle(ctx: RequestContext) {
  ctx.requestId;                    // A
  ctx.user.role;                    // B
  if (ctx.user) {
    ctx.user.role === "seller";     // C
  }
}

const ctx1: RequestContext = { requestId: "r1", path: "/orders" };   // D
const ctx2: RequestContext = { requestId: "r1" };                    // E
```

1. Viết ra interface `RequestContext` sau khi hai khai báo được gộp.
2. Dòng nào lỗi trong A–E?
3. Nếu đổi cả hai khai báo thành `type RequestContext = { ... }` thì chuyện gì xảy ra?
4. Trang web của ShopNhanh nhận cấu hình qua một biến toàn cục do server chèn vào: `window.shopConfig = { apiBaseUrl: "...", locale: "vi" }`. Viết khai báo để `window.shopConfig.locale` có kiểu `"vi" | "en"`. Cho rằng khai báo nằm trong một file không có `import` hay `export`.
5. Sách khuyên hạn chế dùng merging trong code thường ngày. Lý do là gì, và hai tình huống ở bài này khác gì so với "code thường ngày"?

### Bài 5.2 — Xung đột khi gộp

```ts
interface HttpClientOptions {
  timeout: number;
  baseUrl: string;
}

interface HttpClientOptions {
  timeout: string;              // A
}

interface HttpClientOptions {
  baseUrl: string;              // B
  retries: number;
}

interface KeyValueStore {
  get(key: string): string | null;
}

interface KeyValueStore {
  get(key: string, fallback: string): string;   // C
}

declare const store: KeyValueStore;

const token = store.get("token");               // D — kiểu của token?
const name = store.get("name", "khách");        // E — kiểu của name?
store.get("token", 0);                          // F
```

1. Dòng nào lỗi trong A–F?
2. A và C đều khai báo lại một thành viên với kiểu khác. Vì sao A lỗi còn C thì không?
3. Kiểu của `token` và `name` là gì? Khai báo gộp ở C đã tạo ra thứ gì bạn học ở Chương 5?

## Phần 6 — Bài tổng hợp: module giỏ hàng

### Bài 6 — Thiết kế kiểu và cài đặt giỏ hàng

Bạn được giao viết phần kiểu và logic lõi cho giỏ hàng. Yêu cầu từ buổi họp thiết kế:

**Kiểu dữ liệu**

| Interface | Yêu cầu |
| --- | --- |
| `Entity` | `id` và `createdAt` đều là chuỗi và không được gán lại |
| `Product` | Kế thừa `Entity`; có `name`, `priceVnd`; `tags` là mảng chuỗi, có thể không có |
| `Voucher` | `code` không được gán lại; `percent` là số; `minOrderVnd` là số, có thể không có |
| `CartLines` | Ánh xạ từ mã SKU bất kỳ sang số lượng |
| `Catalog` | Ánh xạ từ mã SKU bất kỳ sang `Product`; tra một mã không tồn tại phải buộc người viết xử lý `undefined` |
| `PriceFormatter` | Gọi được với một số, trả về chuỗi; có thêm thuộc tính `currency` là chuỗi |
| `Cart` | Kế thừa `Entity`; có `lines: CartLines`; `voucher` có thể không có; hai method `add` và `subtotal` |

**Hành vi**

- `cart.add(sku, quantity)`: cộng dồn số lượng cho `sku`. `quantity` mặc định là 1.
- `cart.subtotal(catalog)`: tổng `priceVnd × số lượng`. Nếu một SKU không có trong `catalog` thì ném `Error` với nội dung `"Không có sản phẩm <sku> trong danh mục"`.
- `createCart(id, createdAt)`: trả về một `Cart` rỗng.
- `total(cart, catalog)`: lấy `subtotal`, rồi giảm `percent` phần trăm nếu có voucher và `subtotal` đạt `minOrderVnd` (coi là 0 khi voucher không đặt mức tối thiểu).
- `formatVnd`: một `PriceFormatter` trả về `"<số làm tròn> <currency>"`, với `currency` là `"VND"`.

Gợi ý: `add` và `subtotal` cần đọc `this.lines`, nên khai báo chúng theo cú pháp method.


**Kết quả mong đợi**

```ts
const catalog: Catalog = {
  "TRA-01": { id: "p1", createdAt: "2026-09-01", name: "Trà ô long 200g", priceVnd: 185000 },
  "CF-02": { id: "p2", createdAt: "2026-09-03", name: "Cà phê rang xay 500g", priceVnd: 240000, tags: ["cà phê"] },
};

const cart = createCart("c1", "2026-10-11");
cart.add("TRA-01");
cart.add("TRA-01", 2);
cart.add("CF-02");

console.log(cart.lines);                          // { 'TRA-01': 3, 'CF-02': 1 }
console.log(formatVnd(cart.subtotal(catalog)));   // 795000 VND

cart.voucher = { code: "THU10", percent: 10, minOrderVnd: 500000 };
console.log(formatVnd(total(cart, catalog)));     // 715500 VND

cart.voucher = { code: "VIP20", percent: 20, minOrderVnd: 1000000 };
console.log(formatVnd(total(cart, catalog)));     // 795000 VND (chưa đạt mức tối thiểu)

cart.add("BANH-09");
cart.subtotal(catalog);   // ném Error: Không có sản phẩm BANH-09 trong danh mục
```

Ràng buộc: không dùng `any`, `as`, hay toán tử `!`.

**Câu hỏi kiểm tra**

Với kiểu bạn vừa viết, mỗi dòng A–J thuộc loại nào: lỗi biên dịch, hợp lệ, hay biên dịch được nhưng hỏng lúc chạy?

```ts
cart.id = "c2";                                           // A
cart.lines["TRA-01"] = "2";                               // B
cart.lines["KHONG-CO"].toFixed(0);                        // C
catalog["KHONG-CO"].name;                                 // D
cart.voucher.code;                                        // E
const short: PriceFormatter = (amount) => `${amount}đ`;   // F
cart.add("TRA-01");                                       // G
const p: Product = { id: "p3", createdAt: "2026-10-01", name: "Bánh pía", priceVnd: 90000, stock: 3 };  // H
const entity: Entity = cart;                              // I
if (cart.voucher) { cart.voucher.code = "MOI"; }          // J
```

Câu hỏi mở rộng: C và D cùng tra một khoá không tồn tại, nhưng TypeScript chỉ chặn D. Khác biệt trong khai báo của `CartLines` và `Catalog` là gì? Nếu được thiết kế lại, bạn có đổi `CartLines` không?

## Đáp án và giải thích

Mọi đáp án dưới đây đã được kiểm bằng trình biên dịch TypeScript với `strict` bật. Chỉ đọc sau khi đã tự làm.

### Phần 1

**Bài 1.1.**

```ts
type ProductStatus = "active" | "out_of_stock" | "hidden";

interface Seller {
  id: number;
  shopName: string;
  verified: boolean;
}

interface Product {
  id: number;
  sku: string;
  name: string;
  priceVnd: number;
  status: ProductStatus;
  discountPercent?: number;
  seller: Seller;
  tags: string[];
}
```

`ProductStatus` không viết được bằng `interface`: interface chỉ mô tả hình dạng của object, còn đây là một union của ba chuỗi cố định, phải dùng type alias. Đây là lúc nên dùng `type` dù mặc định ưu tiên `interface`.

Lỗi ở cả năm dòng A, B, C, D, E.

| Dòng | Lý do |
| --- | --- |
| A | `id` là `string`, không gán được cho `number` |
| B | `seller` thiếu `verified` |
| C | `null` không gán được cho `number \| undefined`; "có thể không có" khác với "có thể là `null`" |
| D | `"sold"` không thuộc ba giá trị của `ProductStatus` |
| E | `discountPercent` có thể là `undefined` |

Bài học thực tế từ C: nếu backend thật sự trả về `null` cho trường này thì kiểu phải là `discountPercent: number | null`. Kiểu phải khớp với dữ liệu thật, không phải với mong muốn của người viết frontend.

Sửa dòng E:

```ts
const percent = fromApi.discountPercent === undefined ? 0 : fromApi.discountPercent;
const salePrice = fromApi.priceVnd * (1 - percent / 100);
```

**Bài 1.2.**

1. Lỗi ở B, D, G. Các dòng A, C, E, F, H hợp lệ.

| Dòng | Kết quả | Lý do |
| --- | --- | --- |
| A | Hợp lệ | `retries` không phải `readonly` |
| B | Lỗi | Gán lại thuộc tính `readonly` |
| C | Hợp lệ | Không gán lại thuộc tính, chỉ thay đổi nội dung của mảng |
| D | Lỗi | Gán lại thuộc tính `readonly` |
| E | Hợp lệ | `raw` không được khai báo là `AppConfig`; kiểu suy luận của nó không có `readonly` |
| F | Hợp lệ | Thuộc tính ghi được gán được vào chỗ chỉ cần đọc |
| G | Lỗi | Qua biến `config`, thuộc tính là `readonly` |
| H | Hợp lệ | Qua biến `raw`, thuộc tính vẫn ghi được |

2. `readonly` chỉ cấm gán một giá trị mới cho chính thuộc tính đó. Nó không đóng băng object hay mảng mà thuộc tính trỏ tới.
3. In ra `1`. `raw` và `config` là cùng một object, nên sửa qua `raw` thì `config` cũng đổi. `readonly` chỉ có tác dụng ở những nơi object được dùng với kiểu `AppConfig`; nó không ngăn được code giữ một tham chiếu khác tới cùng object.
4. Không còn gì. `readonly` chỉ tồn tại trong hệ thống kiểu và không tạo ra bất kỳ sự bảo vệ nào lúc chạy.

**Bài 1.3.**

1. Lỗi ở A, F, G. Các dòng B, C, D, E hợp lệ. A: `displayName` có thể là `undefined`. F: `phon` không tồn tại trong `UpdateProfileRequest`. G: `"1999"` là `string`, không gán được cho `number`.
2. Đúng với yêu cầu: form chỉ gửi những trường đã đổi, nên không đổi gì là hợp lệ. Nếu nghiệp vụ yêu cầu ít nhất một trường thì đó là việc của bước kiểm tra lúc chạy.
3. Excess property check. Vì đối số là một object literal viết ngay tại chỗ, TypeScript báo thuộc tính lạ và còn gợi ý tên đúng là `phone`. Nếu object được tạo sẵn ở một biến rồi mới truyền vào thì lỗi này sẽ lọt.
4. Sửa dòng A:

```ts
if (req.displayName !== undefined) {
  changes.push(`tên: ${req.displayName.trim()}`);
}
```

### Phần 2

**Bài 2.1.**

1. Cú pháp method: `charge` và `ping`. Cú pháp property: `name`, `refund`, `onSuccess`.
2. Lỗi ở B, C, E, G, H. Các dòng A, D, F hợp lệ.

| Dòng | Kết quả | Lý do |
| --- | --- | --- |
| A | Hợp lệ | Đúng số lượng và kiểu đối số |
| B | Lỗi | `"185000"` là `string` |
| C | Lỗi | `onSuccess` là tuỳ chọn, có thể là `undefined` nên không gọi trực tiếp được |
| D | Hợp lệ | `?.()` chỉ gọi khi `ping` tồn tại |
| E | Lỗi | `name` là `readonly` |
| F | Hợp lệ | `refund` không phải `readonly`; hàm nhận ít tham số hơn vẫn gán được |
| G | Lỗi | `charge` trả về `string` thay vì `boolean` |
| H | Lỗi | Thiếu thành viên bắt buộc `refund` |

3. Object literal được gán vào vị trí đã khai báo kiểu `PaymentGateway`, nên TypeScript suy luận kiểu tham số từ khai báo `charge` trong interface.
4. Đó là lỗi cú pháp: `readonly` chỉ dùng được cho khai báo thuộc tính, không dùng được cho method. Muốn cấm gán lại thì chuyển sang cú pháp property:

```ts
readonly charge: (amountVnd: number, orderId: string) => boolean;
```

**Bài 2.2.**

1. Đó là call signature. Nó dùng dấu `:` trước kiểu trả về, còn function type dùng `=>`.
2. Lỗi ở C, D, E, F. Các dòng A, B hợp lệ. C: `404` không phải `string`. D: `"nhiều"` không gán được cho `number`.
3. E là một hàm gọi được nhưng thiếu hai thuộc tính `prefix` và `count`. F có đủ hai thuộc tính nhưng không gọi được, tức thiếu call signature.
4. Interface tương đương:

```ts
interface FieldValidator {
  (value: string): string | null;
  fieldName: string;
}
```

Dòng A hợp lệ vì TypeScript ghi nhận các thuộc tính được gán lên một khai báo hàm (`log.prefix = ...`, `log.count = ...`) như một phần kiểu của hàm đó.

### Phần 3

**Bài 3.1.**

1. Chỉ dòng B: `3` không gán được cho `string`.
2. Dòng D. Index signature tuyên bố rằng mọi khoá chuỗi đều cho ra một `string`, nên TypeScript tin `vi["order.title"]` là `string` dù giá trị thật là `undefined`. Đây là điểm không an toàn cố hữu của index signature.
3. Hai cách sửa kiểu:

```ts
// Cách 1: thừa nhận giá trị có thể thiếu
interface Translations {
  [key: string]: string | undefined;
}

// Cách 2: dùng Map, vì get() luôn trả về kiểu có | undefined
const vi = new Map<string, string>();
```

4. Viết lại dòng D:

```ts
// Cách 1
const found = vi["order.title"];
const heading = (found === undefined ? "order.title" : found).toUpperCase();

// Cách 2
const found = vi.get("order.title");
const heading = (found === undefined ? "order.title" : found).toUpperCase();
```

**Bài 3.2.**

1. `PORT` có kiểu `number`, không gán được cho kiểu `string` của index signature. Quy tắc: khi interface có index signature chuỗi, kiểu của mọi thuộc tính có tên phải gán được vào kiểu của index signature.
2. Đổi `PORT` thành `string`. Biến môi trường luôn là chuỗi; khai báo `number` sẽ khiến kiểu nói dối về dữ liệu, và phép tính trên nó cho kết quả sai. Việc chuyển sang số nên làm tường minh bằng `Number(env.PORT)`.
3. Kiểu literal `"development" | "production"` gán được vào `string`. Thuộc tính có tên được phép cụ thể hơn index signature, chỉ không được rộng hơn hoặc khác loại.
4. Lỗi ở C, D, E, F. Các dòng B, G hợp lệ.

| Dòng | Kết quả | Lý do |
| --- | --- | --- |
| B | Hợp lệ | Đủ hai thuộc tính bắt buộc; `DATABASE_URL` khớp index signature |
| C | Lỗi | `"staging"` không thuộc `"development" \| "production"` |
| D | Lỗi | Thiếu `NODE_ENV` |
| E | Lỗi | `true` không gán được cho `string` |
| F | Lỗi | `PORT` là `string`, không gán được cho `number` |
| G | Hợp lệ | Index signature cho phép đọc bất kỳ khoá nào dưới dạng `string` |

5. `env1.JWT_SECRET` là `undefined`, nên `.length` ném `TypeError` lúc chạy. Cùng một loại lỗi với Bài 3.1.

**Bài 3.3.**

1. Lỗi ở C và E. Các dòng A, B, D hợp lệ. C: `notFound` không phải khoá số. E: `ok` không khớp index signature số, nên bị coi là thuộc tính thừa.
2. JavaScript chuyển mọi khoá của object thành chuỗi, nên `messages[404]` và `messages["404"]` cùng trỏ tới một thuộc tính. TypeScript hiểu điều đó và chấp nhận chuỗi có dạng số.
3. `First` hợp lệ, `Second` lỗi. Vì khoá số rốt cuộc cũng là khoá chuỗi, kiểu của index signature số phải gán được vào kiểu của index signature chuỗi. `string` gán được vào `string | undefined`; chiều ngược lại thì không.

### Phần 4

**Bài 4.1.**

```ts
interface Address {
  street: string;
  district: string;
  city: string;
  note?: string;
}

interface Customer {
  id: number;
  fullName: string;
  phone: string;
}

interface OrderItem {
  sku: string;
  quantity: number;
  unitPriceVnd: number;
}

interface Order {
  id: string;
  customer: Customer;
  shippingAddress: Address;
  items: OrderItem[];
  paidAt: string | null;
}
```

`note` dùng `?` vì khoá có thể vắng hẳn trong JSON. `paidAt` dùng `string | null` và không có `?` vì khoá luôn có mặt, chỉ giá trị là `null`. Hai cách khai báo này phản ánh hai dạng dữ liệu khác nhau trên đường truyền.

Lỗi ở cả sáu dòng A–F.

| Dòng | Lý do |
| --- | --- |
| A | `shippingAddress` thiếu `district` |
| B | `quantity` là `string` thay vì `number` |
| C | Thiếu `paidAt`; thuộc tính này bắt buộc có mặt dù được phép là `null` |
| D | `note` có thể là `undefined` |
| E | `paidAt` có thể là `null` |
| F | `Customer` không có `email` |

**Bài 4.2.**

```ts
interface Account {
  id: number;
  email: string;
}

interface Timestamped {
  createdAt: string;
  updatedAt: string;
}

interface SoftDeletable {
  deletedAt: string | null;
}

interface Customer extends Account, Timestamped {
  loyaltyPoints: number;
}

interface Seller extends Account, Timestamped, SoftDeletable {
  shopName: string;
}

function lastTouched(entity: Timestamped): string {
  return entity.updatedAt;
}

function isDeleted(entity: SoftDeletable): boolean {
  return entity.deletedAt !== null;
}
```

Lỗi ở D, E, G. Các dòng A, B, C, F hợp lệ.

- D: `Customer` không kế thừa `SoftDeletable` nên thiếu `deletedAt`.
- E: object thiếu `deletedAt`, thuộc tính `Seller` nhận từ `SoftDeletable`.
- F: hợp lệ, `Seller` có đủ mọi thành viên của `Account`.
- G: `Seller` thiếu `loyaltyPoints`.

Lợi ích: hàm dùng lại được cho mọi thực thể có dấu thời gian, kể cả những bảng sẽ thêm sau này, và chữ ký hàm nói rõ hàm thật sự cần gì. Dòng D còn cho thấy một lợi ích nữa: gọi `isDeleted` trên bảng không hỗ trợ xoá mềm bị chặn ngay lúc biên dịch.

**Bài 4.3.**

1. Lỗi ở B và C. A và D hợp lệ. Quy tắc: thuộc tính khai báo lại ở interface con phải có kiểu gán được vào kiểu của thuộc tính đó ở interface cha. Thu hẹp thì được (`"paid"` thuộc union gốc, `string` thuộc `string | null`), mở rộng hoặc đổi sang kiểu khác thì không (`"refunded"` nằm ngoài union, `Date` không phải `string`).
2. Mọi giá trị của interface con phải dùng được ở nơi cần interface cha. Một hàm nhận `PaymentEvent` được viết với giả định `status` chỉ có ba giá trị; nếu `RefundedEvent` hợp lệ thì hàm đó sẽ nhận một giá trị nó chưa từng xử lý.
3. `anyDate` lỗi vì `paidAt` có thể là `null`. `receiptDate` hợp lệ vì `PaidEvent` đã thu hẹp `paidAt` thành `string`. Lợi ích: việc kiểm tra `null` được làm một lần ở nơi tạo ra `PaidEvent`, các hàm phía sau không phải lặp lại.
4. Sửa ở interface cha: thêm `"refunded"` vào union của `PaymentEvent.status`. Khi đó trình biên dịch sẽ chỉ ra những nơi đang xử lý `status` mà cần cập nhật.

### Phần 5

**Bài 5.1.**

1. Kết quả sau khi gộp:

```ts
interface RequestContext {
  requestId: string;
  path: string;
  user?: { id: string; role: "admin" | "customer" };
}
```

2. Lỗi ở B, C, E. Các dòng A, D hợp lệ. B: `user` có thể là `undefined`. C: phép so sánh vô nghĩa, vì `"seller"` không thuộc `"admin" | "customer"`. E: thiếu `path`, thuộc tính bắt buộc từ khai báo của thư viện.
3. Lỗi "Duplicate identifier". Type alias không gộp được; mỗi tên chỉ được khai báo một lần. Đây là một trong những khác biệt chính giữa `type` và `interface`.
4. Khai báo cho `window`:

```ts
interface Window {
  shopConfig: {
    apiBaseUrl: string;
    locale: "vi" | "en";
  };
}

window.shopConfig.locale; // "vi" | "en"
```

5. Khi một interface được khai báo rải rác ở nhiều nơi, người đọc khó biết hình dạng đầy đủ của nó. Hai tình huống ở bài này là ngoại lệ chính đáng: kiểu gốc thuộc về code bạn không sở hữu (thư viện, môi trường trình duyệt), nên merging là cách duy nhất để bổ sung mà không sửa file của người khác.

**Bài 5.2.**

1. Lỗi ở A và F. Các dòng B, C, D, E hợp lệ. B hợp lệ vì `baseUrl` được khai báo lại với đúng kiểu cũ, và `retries` là thuộc tính mới.
2. A khai báo lại một property với kiểu khác, điều không được phép: các khai báo sau phải giữ nguyên kiểu. C khai báo lại một method với chữ ký khác, và TypeScript coi đó là thêm một overload cho method.
3. `token` có kiểu `string | null`, `name` có kiểu `string`. Hai khai báo `get` tạo thành function overload: gọi với một đối số khớp chữ ký thứ nhất, gọi với hai đối số khớp chữ ký thứ hai. Dòng F lỗi vì không chữ ký nào nhận `fallback` là số.

### Phần 6

**Bài 6.** Một lời giải mẫu:

```ts
interface Entity {
  readonly id: string;
  readonly createdAt: string;
}

interface Product extends Entity {
  name: string;
  priceVnd: number;
  tags?: string[];
}

interface Voucher {
  readonly code: string;
  percent: number;
  minOrderVnd?: number;
}

interface CartLines {
  [sku: string]: number;
}

interface Catalog {
  [sku: string]: Product | undefined;
}

interface PriceFormatter {
  (amount: number): string;
  currency: string;
}

interface Cart extends Entity {
  lines: CartLines;
  voucher?: Voucher;
  add(sku: string, quantity?: number): void;
  subtotal(catalog: Catalog): number;
}

function createCart(id: string, createdAt: string): Cart {
  return {
    id,
    createdAt,
    lines: {},
    add(sku, quantity = 1) {
      const current = this.lines[sku];
      this.lines[sku] = current === undefined ? quantity : current + quantity;
    },
    subtotal(catalog) {
      let sum = 0;
      for (const sku of Object.keys(this.lines)) {
        const product = catalog[sku];
        if (product === undefined) {
          throw new Error(`Không có sản phẩm ${sku} trong danh mục`);
        }
        sum += product.priceVnd * this.lines[sku];
      }
      return sum;
    },
  };
}

function total(cart: Cart, catalog: Catalog): number {
  const subtotal = cart.subtotal(catalog);
  const voucher = cart.voucher;
  if (voucher === undefined) {
    return subtotal;
  }
  const minimum = voucher.minOrderVnd === undefined ? 0 : voucher.minOrderVnd;
  if (subtotal < minimum) {
    return subtotal;
  }
  return subtotal * (1 - voucher.percent / 100);
}

function formatVnd(amount: number): string {
  return `${Math.round(amount)} ${formatVnd.currency}`;
}
formatVnd.currency = "VND";
```

Kiểm tra số liệu: 3 × 185000 + 1 × 240000 = 795000. Voucher `THU10` cần tối thiểu 500000 nên được áp: 795000 × 0,9 = 715500. Voucher `VIP20` cần 1000000 nên không được áp.

Một chi tiết đáng chú ý trong `add`: `this.lines[sku]` có kiểu `number` theo index signature, nhưng lần đầu thêm một SKU thì giá trị thật là `undefined`. Lời giải vẫn phải tự kiểm tra `undefined` dù kiểu không yêu cầu. Nếu bỏ bước kiểm tra, phép cộng cho ra `NaN` mà không có lỗi biên dịch nào.

Câu hỏi kiểm tra:

| Dòng | Kết quả | Lý do |
| --- | --- | --- |
| A | Lỗi biên dịch | `id` là `readonly`, kế thừa từ `Entity` |
| B | Lỗi biên dịch | `"2"` không gán được cho `number` |
| C | Hỏng lúc chạy | Biên dịch được vì `CartLines` hứa trả về `number`; giá trị thật là `undefined` nên `.toFixed` ném `TypeError` |
| D | Lỗi biên dịch | `Catalog` trả về `Product \| undefined` |
| E | Lỗi biên dịch | `voucher` có thể là `undefined` |
| F | Lỗi biên dịch | Hàm thiếu thuộc tính `currency` |
| G | Hợp lệ | `quantity` là tham số tuỳ chọn |
| H | Lỗi biên dịch | `stock` là thuộc tính thừa trong object literal |
| I | Hợp lệ | `Cart` kế thừa `Entity` nên gán được |
| J | Lỗi biên dịch | `code` là `readonly` |

Câu hỏi mở rộng: `Catalog` khai báo giá trị là `Product | undefined`, còn `CartLines` khai báo giá trị là `number`. Chỉ cần thêm `| undefined` là TypeScript buộc người viết xử lý trường hợp thiếu khoá. Với `CartLines`, đổi thành `number | undefined` hoặc dùng `Map<string, number>` sẽ an toàn hơn, và bước kiểm tra `undefined` trong `add` khi đó sẽ do trình biên dịch yêu cầu thay vì phải tự nhớ. Cái giá là mọi nơi đọc số lượng đều phải xử lý `undefined`; đó là một đánh đổi thiết kế có chủ đích chứ không có đáp án duy nhất.

### Tự đánh giá

| Số bài làm đúng | Gợi ý |
| --- | --- |
| 12–14 | Nắm chắc chương, có thể sang Chương 8 |
| 8–11 | Xem lại phần sai nhiều nhất, làm lại sau một ngày |
| Dưới 8 | Đọc lại chương, chú ý mục Read-Only Properties và Index Signatures |