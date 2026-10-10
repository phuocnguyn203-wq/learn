# Bài tập TypeScript — Chương 5: Functions (Intermediate)

Bộ bài tập luyện kiến thức Chương 5 "Functions" của sách *Learning TypeScript* (Josh Goldberg). Toàn bộ ví dụ trong bài là ví dụ mới, không lấy lại từ sách: bối cảnh là một quán cà phê, phí giao hàng, điểm số và nhiệt độ.

## Mục lục

- [Cách làm bài](#cách-làm-bài)
- [Phần 1 — Tham số: bắt buộc, tuỳ chọn, mặc định, rest](#phần-1--tham-số-bắt-buộc-tuỳ-chọn-mặc-định-rest)
- [Phần 2 — Kiểu trả về](#phần-2--kiểu-trả-về)
- [Phần 3 — Function types](#phần-3--function-types)
- [Phần 4 — `void` và `never`](#phần-4--void-và-never)
- [Phần 5 — Function overloads](#phần-5--function-overloads)
- [Phần 6 — Bài tổng hợp: tính tiền quán cà phê](#phần-6--bài-tổng-hợp-tính-tiền-quán-cà-phê)
- [Đáp án và giải thích](#đáp-án-và-giải-thích)

## Cách làm bài

Bộ bài gồm 18 bài, làm trong khoảng 120 phút. Mọi đoạn code giả định bật `strict` trong `tsconfig.json`.

- **Dự đoán trước, chạy sau.** Ghi câu trả lời ra giấy rồi mới dán code vào TypeScript Playground để kiểm tra.
- **Giải thích bằng lời.** Với mỗi dòng lỗi, nêu được TypeScript phàn nàn về điều gì.
- **Không dùng `any`, `as` hay `// @ts-ignore`** để làm lỗi biến mất.
- Đáp án nằm ở cuối file. Làm xong cả phần rồi mới đối chiếu.

| Phần | Chủ đề | Số bài | Thời gian gợi ý |
| --- | --- | --- | --- |
| 1 | Tham số bắt buộc, tuỳ chọn, mặc định, rest | 4 | 20 phút |
| 2 | Kiểu trả về suy luận và tường minh | 3 | 15 phút |
| 3 | Function types, callback, alias | 4 | 25 phút |
| 4 | `void` và `never` | 3 | 15 phút |
| 5 | Function overloads | 3 | 15 phút |
| 6 | Bài tổng hợp | 1 | 30 phút |

## Phần 1 — Tham số: bắt buộc, tuỳ chọn, mặc định, rest

Trọng tâm: TypeScript đếm số đối số, và ba cách "cho phép bỏ trống" (`?`, `| undefined`, giá trị mặc định) không giống nhau.

### Bài 1.1 — Đếm đối số

Dòng nào trong A–E bị lỗi? Nêu lý do cho từng dòng lỗi.

```ts
function shippingFee(distanceKm: number, express: boolean) {
  return distanceKm * (express ? 9000 : 5000);
}

shippingFee(3, true);          // A
shippingFee(3);                // B
shippingFee(3, true, "HN");    // C
shippingFee("3", false);       // D
shippingFee(3, undefined);     // E
```

Câu hỏi thêm: trong JavaScript thuần, dòng B chạy ra kết quả gì? Vì sao TypeScript chặn nó là có ích?

### Bài 1.2 — `?`, `| undefined` và giá trị mặc định

Dự đoán dòng nào lỗi trong A–J.

```ts
function greet(name: string, title?: string) {
  return title.toUpperCase() + " " + name;        // A
}

function tag(label: string, color: string | undefined) {
  return color === undefined ? label : `${label} (${color})`;
}

function repeat(text: string, times = 2) {
  return text.repeat(times);                      // B
}

greet("An");                 // C
greet("An", undefined);      // D
tag("sale");                 // E
tag("sale", undefined);      // F
repeat("ha");                // G
repeat("ha", undefined);     // H
repeat("ha", "3");           // I

function makeId(prefix?: string, id: number) {    // J
  return `${prefix}-${id}`;
}
```

1. Bên trong `greet`, kiểu của `title` là gì? Sửa dòng A để hàm trả về chỉ `name` khi không có `title`.
2. Bên trong `repeat`, kiểu của `times` là gì? Còn từ phía người gọi thì tham số đó nhận những kiểu nào?
3. `times` không có chú thích kiểu. TypeScript biết kiểu của nó nhờ đâu?

### Bài 1.3 — Rest parameters

```ts
function total(table: string, ...prices: number[]) {
  let sum = 0;
  for (const price of prices) sum += price;
  return `${table}: ${sum}`;
}

total("Bàn 3");                          // A
total("Bàn 3", 25000, 30000);            // B
total("Bàn 3", 25000, "30000");          // C
total("Bàn 3", [25000, 30000]);          // D

const bill = [25000, 30000];
total("Bàn 3", ...bill);                 // E

function wrong(...items: string[], last: number) {}   // F
```

1. Dòng nào lỗi trong A–F?
2. D và E đều đưa vào cùng một mảng. Vì sao kết quả khác nhau?
3. Viết hàm `average(...scores: number[]): number` trả về điểm trung bình, và trả về `0` khi không có đối số nào.

### Bài 1.4 — Viết hàm từ mô tả

Viết hàm `formatPrice` thoả các yêu cầu:

- Tham số thứ nhất `amount` là số, bắt buộc.
- Tham số thứ hai `currency` là chuỗi, mặc định là `"VND"`.
- Tham số thứ ba `decimals` là số, tuỳ chọn. Khi có, số tiền được làm tròn tới đúng số chữ số thập phân đó (gợi ý: `toFixed`). Khi không có, in số tiền nguyên dạng.
- Kiểu trả về khai báo tường minh là `string`.

Kết quả mong đợi:

```ts
formatPrice(25000);               // "25000 VND"
formatPrice(2.5, "USD", 2);       // "2.50 USD"
formatPrice(2.5, undefined, 1);   // "2.5 VND"
formatPrice(1, 2);                // lỗi biên dịch — vì sao?
```

## Phần 2 — Kiểu trả về

Phần này luyện đọc kiểu trả về mà TypeScript tự suy luận, và nhận ra khi nào cần ghi tường minh.

### Bài 2.1 — Đoán kiểu suy luận

Ghi ra kiểu đầy đủ của mỗi hàm theo dạng `(tham số) => kiểu trả về`.

```ts
function half(n: number) {
  return n / 2;
}

function grade(score: number) {
  if (score >= 8) return "giỏi";
  if (score >= 5) return "đạt";
  return undefined;
}

function indexOfItem(items: string[], target: string) {
  for (let i = 0; i < items.length; i += 1) {
    if (items[i] === target) return i;
  }
}

function logTwice(message: string) {
  console.log(message);
  console.log(message);
}

const toLabel = (n: number) => (n > 0 ? "dương" : n);
```

Câu hỏi thêm: `indexOfItem` không có lệnh `return undefined` nào. `undefined` trong kiểu trả về của nó đến từ đâu?

### Bài 2.2 — Kiểu trả về tường minh

Dòng nào lỗi trong A–D?

```ts
function parseQuantity(input: string): number {
  if (input === "") {
    return;                    // A
  }
  const value = Number(input);
  if (Number.isNaN(value)) {
    return "invalid";          // B
  }
  return value;                // C
}

function sign(n: number): string {   // D
  if (n > 0) return "dương";
  if (n < 0) return "âm";
}
```

1. Giải thích từng lỗi.
2. Nếu xoá chú thích `: number` của `parseQuantity`, code có còn lỗi không? Kiểu trả về suy luận sẽ là gì? Việc đó có lợi hay hại cho người gọi hàm?
3. Sửa `sign` theo hai cách khác nhau.

### Bài 2.3 — Hàm đệ quy

```ts
function sumTo(n: number) {
  return n <= 0 ? 0 : n + sumTo(n - 1);
}
```

1. TypeScript báo lỗi gì ở hàm này, dù mọi nhánh rõ ràng đều trả về số?
2. Sửa bằng một thay đổi nhỏ nhất.
3. Viết `factorial` dưới dạng arrow function đệ quy, có kiểu trả về tường minh. Chú thích kiểu trả về của arrow function đặt ở đâu?

## Phần 3 — Function types

Phần này luyện viết kiểu cho biến và tham số chứa hàm, và đọc lỗi khi hai kiểu hàm không khớp.

### Bài 3.1 — Viết kiểu hàm

Viết chú thích kiểu cho năm biến theo mô tả:

1. `isOpen`: hàm không nhận gì, trả về `boolean`.
2. `priceAfter`: hàm nhận `price` là số và `percent` là số tuỳ chọn, trả về số.
3. `printNames`: hàm nhận một mảng chuỗi, không trả về giá trị dùng được.
4. `maybeCounter`: hoặc là `null`, hoặc là một hàm không nhận gì và trả về số.
5. `nextId`: một hàm không nhận gì, trả về số hoặc `null`.

Sau đó cho biết: trong hai biến ở mục 4 và 5, biến nào gán được `null`, biến nào gán được `() => null`?

### Bài 3.2 — Callback khớp và không khớp

Dự đoán dòng nào lỗi trong A–G.

```ts
function applyToAll(prices: number[], transform: (price: number) => number) {
  const result: number[] = [];
  for (const price of prices) result.push(transform(price));
  return result;
}

const menu = [25000, 32000, 45000];

function addVat(price: number) { return price * 1.1; }
function label(price: number) { return `${price}đ`; }
function discount(price: number, percent: number) { return price * (1 - percent / 100); }
function free() { return 0; }

applyToAll(menu, addVat);                        // A
applyToAll(menu, label);                         // B
applyToAll(menu, discount);                      // C
applyToAll(menu, free);                          // D
applyToAll(menu, (price) => price.toFixed(0));   // E
applyToAll(menu, (price) => Math.round(price));  // F
applyToAll(menu, addVat(1000));                  // G
```

1. `free` nhận ít tham số hơn kiểu yêu cầu, `discount` nhận nhiều hơn. Vì sao một cái được, một cái không? (Gợi ý: nghĩ xem `applyToAll` sẽ gọi `transform` với mấy đối số.)
2. Với dòng B, thông báo lỗi có nhiều tầng. Tầng cuối cùng nói gì?
3. Dòng G nhầm lẫn giữa hai việc nào?

### Bài 3.3 — Suy luận kiểu tham số

```ts
let validator: (value: string) => boolean;

validator = (value) => value.length > 0;        // A
validator = (value) => value.trim();            // B
validator = (value: number) => value > 0;       // C
validator = () => true;                         // D

const drinks = ["trà", "cà phê"];
drinks.forEach((drink, position) => {
  // kiểu của drink và position?
});

function standalone(value) { return value; }    // E
```

1. Dòng nào lỗi trong A–E?
2. Ở dòng A, `value` không có chú thích kiểu nhưng vẫn gọi được `.length`. Ở dòng E, `value` cũng không có chú thích kiểu nhưng lại bị báo lỗi. Khác biệt nằm ở đâu?
3. Kiểu của `drink` và `position` là gì?

### Bài 3.4 — Function type alias

Đoạn code sau lặp lại cùng một kiểu hàm ba lần.

```ts
const add: (a: number, b: number) => number = (a, b) => a + b;
const max: (a: number, b: number) => number = (a, b) => (a > b ? a : b);

function calculate(a: number, b: number, op: (a: number, b: number) => number): number {
  return op(a, b);
}
```

1. Tạo alias `BinaryOp` và viết lại ba chỗ trên.
2. Với alias đó, dòng nào lỗi trong A–D?

```ts
const join: BinaryOp = (a, b) => `${a}${b}`;     // A
const negate: BinaryOp = (a) => -a;              // B
const clamp: BinaryOp = (a, b, c) => a;          // C
calculate(2, 3, "add");                          // D
```

## Phần 4 — `void` và `never`

Trọng tâm: `void` nghĩa là "giá trị trả về bị bỏ qua", khác với `undefined`; `never` nghĩa là "hàm không bao giờ trả về".

### Bài 4.1 — `void`

Dự đoán dòng nào lỗi trong A–G.

```ts
function notify(message: string): void {
  if (!message) {
    return;                    // A
  }
  console.log(message);
  return message.length;       // B
}

let onDone: () => void;
onDone = () => 42;             // C
const result = onDone();       // D — kiểu của result?
let count: number | undefined = onDone();   // E

function noReturn() {}
let nothing: undefined = noReturn();        // F

const seen: number[] = [];
[1, 2, 3].forEach((value) => seen.push(value));   // G
```

1. B và C đều "trả về một số ở chỗ khai báo `void`". Vì sao B lỗi còn C thì không?
2. Lúc chạy, `onDone()` thật sự trả về `42`. Vì sao dòng E vẫn bị từ chối?
3. `seen.push(value)` trả về một số. Vì sao dòng G hợp lệ?

### Bài 4.2 — `never`

```ts
function stop(reason: string): never {
  throw new Error(reason);
}

function toCelsius(kelvin: number | undefined) {
  if (kelvin === undefined) {
    stop("Thiếu nhiệt độ");
  }
  return kelvin - 273.15;      // A
}
```

1. Dòng A hợp lệ dù `kelvin` có thể là `undefined` ở đầu hàm. Điều gì giúp TypeScript thu hẹp kiểu?
2. Xoá chú thích `: never` của `stop`. Kiểu trả về suy luận của `stop` là gì? Dòng A lúc này ra sao?
3. Hàm dưới đây bị lỗi ở đâu và vì sao?

```ts
function maybeStop(really: boolean): never {
  if (really) {
    throw new Error("dừng");
  }
}
```

### Bài 4.3 — Chọn kiểu trả về

Với mỗi hàm, chọn chú thích kiểu trả về phù hợp nhất trong `void`, `never`, `undefined`, `string | undefined`, và giải thích ngắn gọn.

```ts
function a(message: string) {
  console.log(`[quán] ${message}`);
}

function b() {
  while (true) {
    console.log("đang chờ đơn...");
  }
}

function c(codes: string[], wanted: string) {
  for (const code of codes) {
    if (code === wanted) return code;
  }
  return undefined;
}

function d(field: string) {
  throw new Error(`Thiếu trường ${field}`);
}
```

Câu hỏi thêm: viết kiểu cho tham số `onTick` của một hàm `everySecond(onTick)`, biết rằng `everySecond` gọi `onTick` với số giây đã trôi qua và không dùng tới kết quả trả về.

## Phần 5 — Function overloads

Phần này luyện đọc overload, nhận ra overload không tương thích, và biết khi nào không nên dùng.

### Bài 5.1 — Gọi hàm có overload

```ts
function find(id: number): string;
function find(name: string, exact: boolean): string;
function find(key: number | string, exact?: boolean) {
  if (typeof key === "number") return `#${key}`;
  return exact ? key : `${key}*`;
}

find(7);              // A
find("An", true);     // B
find("An");           // C
find(7, true);        // D
find(true);           // E
```

1. Dòng nào lỗi trong A–E?
2. Chữ ký triển khai (dòng thứ ba) nhận `key: number | string` và `exact?: boolean`. Theo chữ ký đó thì C và D đều hợp lệ. Vì sao chúng vẫn bị từ chối?
3. Sau khi biên dịch sang JavaScript, hai dòng overload đầu còn lại gì?

### Bài 5.2 — Overload không tương thích

Hai hàm sau mỗi hàm có đúng một overload bị báo "This overload signature is not compatible with its implementation signature". Tìm ra và sửa.

```ts
function toText(value: number): string;
function toText(value: boolean): string;
function toText(values: string[], separator: string): string;
function toText(value: number | boolean, separator?: string): string {
  return `${value}`;
}

function size(value: string): number;
function size(value: string[]): string;
function size(value: string | string[]): number {
  return value.length;
}
```

1. Ở `toText`, overload nào sai và sai ở tham số hay ở kiểu trả về?
2. Ở `size`, overload nào sai và sai ở đâu?
3. Sửa `toText` bằng cách chỉnh chữ ký triển khai, và viết lại phần thân cho đúng với cả ba cách gọi.

### Bài 5.3 — Khi nào không cần overload

Hai hàm sau dùng overload nhưng không cần thiết. Viết lại mỗi hàm bằng một chữ ký duy nhất, giữ nguyên các cách gọi hợp lệ.

```ts
function pad(text: string): string;
function pad(text: string, width: number): string;
function pad(text: string, width?: number): string {
  return text.padEnd(width === undefined ? 10 : width);
}

function len(value: string): number;
function len(value: string[]): number;
function len(value: string | string[]): number {
  return value.length;
}
```

Câu hỏi thêm: so với Bài 5.1, vì sao `find` thật sự cần overload còn `pad` và `len` thì không?

## Phần 6 — Bài tổng hợp: tính tiền quán cà phê

Bài này dùng gần hết kiến thức của chương trong một chương trình nhỏ.

### Bài 6 — Viết bộ hàm tính tiền

Viết các kiểu và hàm sau.

| Tên | Mô tả |
| --- | --- |
| `PriceRule` | Alias cho hàm nhận `subtotal` là số và trả về số |
| `Receiver` | Alias cho hàm nhận `total` là số, kết quả trả về bị bỏ qua |
| `reject(reason)` | Luôn ném `Error` với nội dung `"Đơn không hợp lệ: <reason>"`; không bao giờ trả về |
| `sum(...prices)` | Nhận số lượng bất kỳ các số, trả về tổng |
| `percentOff(percent)` | Trả về một `PriceRule` giảm `percent` phần trăm |
| `applyRules(subtotal, ...rules)` | Áp lần lượt từng `PriceRule` lên `subtotal`, trả về kết quả cuối |
| `formatTotal` | Có hai cách gọi, xem bên dưới |
| `checkout(prices, onDone, tip)` | Xem bên dưới |

`formatTotal` có đúng hai cách gọi hợp lệ:

- `formatTotal(total)` trả về `"<total làm tròn> VND"`.
- `formatTotal(total, currency, rate)` trả về `"<total / rate, 2 chữ số thập phân> <currency>"`.

Gọi với hai đối số phải là lỗi biên dịch.

`checkout(prices: number[], onDone: Receiver, tip = 0)`:

1. Nếu `prices` rỗng thì gọi `reject("giỏ hàng trống")`.
2. Tính tổng bằng `sum`.
3. Áp hai luật theo thứ tự: giảm 10%, rồi cộng 15000 phí giao nếu số tiền dưới 100000.
4. Cộng `tip`, rồi gọi `onDone` với kết quả.
5. Không trả về gì.

**Kết quả mong đợi**

```ts
checkout([25000, 32000, 45000], (total) => console.log(formatTotal(total)));
// 106800 VND

checkout([25000, 32000], (total) => console.log(formatTotal(total, "USD", 25000)), 5000);
// 2.85 USD

const history: number[] = [];
checkout([60000, 70000], (total) => history.push(total));
// history là [117000]

checkout([], (total) => console.log(total));
// ném Error: Đơn không hợp lệ: giỏ hàng trống
```

Ràng buộc: không dùng `any`, `as`, hay toán tử `!`. Mọi hàm có kiểu trả về tường minh.

**Câu hỏi kiểm tra**

Với các hàm bạn vừa viết, dòng nào trong A–H bị lỗi và vì sao?

```ts
sum();                                                        // A
sum([25000, 32000]);                                          // B
applyRules(100000, percentOff);                               // C
applyRules(100000, percentOff(10), (s) => s - 5000);          // D
formatTotal(91800, "USD");                                    // E
checkout([25000], (total) => total * 2);                      // F
checkout([25000], (total, tip) => console.log(total + tip));  // G
const paid: number = checkout([25000], console.log);          // H
```

## Đáp án và giải thích

Mọi đáp án dưới đây đã được kiểm bằng trình biên dịch TypeScript với `strict` bật. Chỉ đọc sau khi đã tự làm.

### Phần 1

**Bài 1.1.** Lỗi ở B, C, D, E. Chỉ dòng A hợp lệ.

| Dòng | Kết quả | Lý do |
| --- | --- | --- |
| A | Hợp lệ | Đủ hai đối số, đúng kiểu |
| B | Lỗi | Cần 2 đối số nhưng chỉ có 1 |
| C | Lỗi | Cần 2 đối số nhưng có 3 |
| D | Lỗi | `"3"` là `string`, không gán được cho `number` |
| E | Lỗi | `undefined` không gán được cho `boolean`; tham số này không phải tuỳ chọn |

Trong JavaScript thuần, dòng B chạy ra `15000`: `express` là `undefined` nên nhánh `5000` được chọn. Người gọi quên một đối số mà không nhận được cảnh báo nào, và kết quả trông vẫn hợp lý. TypeScript chặn đúng loại lỗi im lặng này.

**Bài 1.2.** Lỗi ở A, E, I, J. Các dòng B, C, D, F, G, H hợp lệ.

| Dòng | Kết quả | Lý do |
| --- | --- | --- |
| A | Lỗi | `title` có thể là `undefined` |
| B | Hợp lệ | Bên trong hàm, `times` là `number` |
| C, D | Hợp lệ | Tham số tuỳ chọn được phép vắng hoặc là `undefined` |
| E | Lỗi | `color` là tham số bắt buộc, dù kiểu của nó chứa `undefined` |
| F | Hợp lệ | Có truyền đối số, giá trị là `undefined` |
| G, H | Hợp lệ | Tham số có giá trị mặc định được phép vắng hoặc là `undefined` |
| I | Lỗi | `"3"` không gán được cho `number` |
| J | Lỗi | Tham số bắt buộc không được đứng sau tham số tuỳ chọn |

1. `title` có kiểu `string | undefined`. Một cách sửa:

```ts
function greet(name: string, title?: string) {
  if (title === undefined) {
    return name;
  }
  return title.toUpperCase() + " " + name;
}
```

2. Bên trong hàm, `times` là `number` vì giá trị mặc định luôn lấp chỗ trống. Từ phía người gọi, tham số đó nhận `number | undefined` hoặc được bỏ qua.
3. TypeScript suy luận kiểu từ giá trị mặc định `2`, giống như suy luận kiểu cho một biến có giá trị khởi tạo.

**Bài 1.3.**

1. Lỗi ở C, D, F. Dòng C đưa `string` vào chỗ cần `number`. Dòng D đưa cả một mảng `number[]` vào chỗ cần một `number`. Dòng F: rest parameter phải là tham số cuối cùng.
2. Ở D, mảng là một đối số duy nhất. Ở E, toán tử `...` trải mảng ra thành từng đối số riêng, mỗi đối số là một `number`.
3. Một lời giải:

```ts
function average(...scores: number[]): number {
  if (scores.length === 0) {
    return 0;
  }
  let sum = 0;
  for (const score of scores) {
    sum += score;
  }
  return sum / scores.length;
}
```

**Bài 1.4.**

```ts
function formatPrice(amount: number, currency = "VND", decimals?: number): string {
  const text = decimals === undefined ? `${amount}` : amount.toFixed(decimals);
  return `${text} ${currency}`;
}
```

`formatPrice(1, 2)` lỗi vì `currency` được suy luận là `string` từ giá trị mặc định, nên `2` không gán được. Muốn truyền `decimals` mà giữ đơn vị mặc định thì viết `formatPrice(1, undefined, 2)`.

### Phần 2

**Bài 2.1.**

| Hàm | Kiểu |
| --- | --- |
| `half` | `(n: number) => number` |
| `grade` | `(score: number) => "giỏi" \| "đạt" \| undefined` |
| `indexOfItem` | `(items: string[], target: string) => number \| undefined` |
| `logTwice` | `(message: string) => void` |
| `toLabel` | `(n: number) => number \| "dương"` |

Hai điểm đáng chú ý: kiểu trả về là union của mọi giá trị có thể trả về, và các chuỗi cố định được giữ ở dạng kiểu literal (`"giỏi"`, không phải `string`).

Ở `indexOfItem`, khi vòng lặp kết thúc mà không tìm thấy, hàm chạy tới cuối thân mà không gặp `return`. Một hàm như vậy trả về `undefined`, nên TypeScript thêm `undefined` vào kiểu trả về.

**Bài 2.2.** Lỗi ở A, B, D. Dòng C hợp lệ.

1. A: `return;` trả về `undefined`, không gán được cho `number`. B: `"invalid"` là `string`, không gán được cho `number`. D: hàm thiếu `return` ở nhánh `n === 0`, trong khi kiểu trả về `string` không chứa `undefined`.
2. Không còn lỗi. Kiểu suy luận trở thành `number | "invalid" | undefined`. Điều đó có hại cho người gọi: họ phải xử lý ba trường hợp, và lỗi thiết kế của hàm bị đẩy sang nơi khác thay vì được báo ngay tại chỗ. Đây là lý do nên ghi kiểu trả về tường minh cho hàm có nhiều nhánh `return`.
3. Hai cách sửa `sign`:

```ts
// Cách 1: xử lý nhánh còn thiếu
function sign(n: number): string {
  if (n > 0) return "dương";
  if (n < 0) return "âm";
  return "không";
}

// Cách 2: thừa nhận hàm có thể không có kết quả
function sign(n: number): string | undefined {
  if (n > 0) return "dương";
  if (n < 0) return "âm";
  return undefined;
}
```

**Bài 2.3.**

1. TypeScript báo `sumTo` ngầm có kiểu trả về `any`, vì hàm không có chú thích kiểu trả về mà lại tự gọi chính nó trong biểu thức `return`. TypeScript không tự suy luận kiểu trả về xuyên qua lời gọi đệ quy.
2. Thêm `: number`:

```ts
function sumTo(n: number): number {
  return n <= 0 ? 0 : n + sumTo(n - 1);
}
```

3. Với arrow function, chú thích kiểu trả về đặt sau dấu `)` của danh sách tham số, ngay trước `=>`:

```ts
const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));
```

### Phần 3

**Bài 3.1.**

```ts
let isOpen: () => boolean;
let priceAfter: (price: number, percent?: number) => number;
let printNames: (names: string[]) => void;
let maybeCounter: (() => number) | null;
let nextId: () => number | null;
```

`maybeCounter` gán được `null` nhưng không gán được `() => null`. `nextId` thì ngược lại: gán được `() => null` nhưng không gán được `null`. Cặp ngoặc đơn quyết định `| null` thuộc về cả biến hay chỉ thuộc về kiểu trả về.

**Bài 3.2.** Lỗi ở B, C, E, G. Các dòng A, D, F hợp lệ.

| Dòng | Kết quả | Lý do |
| --- | --- | --- |
| A | Hợp lệ | Khớp `(price: number) => number` |
| B | Lỗi | `label` trả về `string` |
| C | Lỗi | `discount` cần 2 đối số, nhưng `applyToAll` chỉ gọi với 1 |
| D | Hợp lệ | Hàm nhận ít tham số hơn vẫn dùng được |
| E | Lỗi | `toFixed` trả về `string` |
| F | Hợp lệ | `price` được suy luận là `number`, `Math.round` trả về `number` |
| G | Lỗi | `addVat(1000)` là một `number`, không phải hàm |

1. `applyToAll` gọi `transform(price)` với đúng một đối số. `free` bỏ qua đối số đó thì không sao, giống như callback của `forEach` không buộc phải nhận `index`. `discount` thì cần `percent` mà không ai truyền, nên bên trong nó sẽ là `undefined`.
2. Tầng cuối là lời phàn nàn cụ thể nhất: `Type 'string' is not assignable to type 'number'`. Các tầng trên chỉ ra hai kiểu hàm đang được so sánh.
3. Dòng G nhầm giữa việc truyền bản thân hàm (`addVat`) và truyền kết quả của một lần gọi hàm (`addVat(1000)`).

**Bài 3.3.**

1. Lỗi ở B, C, E. Dòng B trả về `string` thay vì `boolean`. Dòng C khai báo tham số là `number` trong khi kiểu của biến yêu cầu nhận `string`. Dòng E: tham số ngầm có kiểu `any`. Dòng D hợp lệ vì hàm được phép nhận ít tham số hơn.
2. Ở dòng A, hàm được gán vào một vị trí đã khai báo kiểu, nên TypeScript suy luận `value` là `string` từ kiểu của `validator`. Ở dòng E, hàm đứng một mình, không có ngữ cảnh nào để suy luận.
3. `drink` là `string`, `position` là `number`, suy luận từ kiểu callback của `forEach` trên một mảng `string[]`.

**Bài 3.4.**

```ts
type BinaryOp = (a: number, b: number) => number;

const add: BinaryOp = (a, b) => a + b;
const max: BinaryOp = (a, b) => (a > b ? a : b);

function calculate(a: number, b: number, op: BinaryOp): number {
  return op(a, b);
}
```

Lỗi ở A, C, D. Dòng B hợp lệ.

- A: hàm trả về `string`, trong khi `BinaryOp` trả về `number`.
- B: hợp lệ, hàm chỉ dùng tham số đầu tiên.
- C: hàm khai báo 3 tham số, nhưng `BinaryOp` chỉ cung cấp 2.
- D: `"add"` là một chuỗi, không phải hàm.

### Phần 4

**Bài 4.1.** Lỗi ở B, E, F. Các dòng A, C, D, G hợp lệ.

| Dòng | Kết quả | Lý do |
| --- | --- | --- |
| A | Hợp lệ | `return;` không kèm giá trị |
| B | Lỗi | Hàm khai báo trả về `void` không được trả về một `number` |
| C | Hợp lệ | Gán hàm vào một kiểu hàm trả về `void`; giá trị trả về bị bỏ qua |
| D | Hợp lệ | `result` có kiểu `void` |
| E | Lỗi | `void` không gán được cho `number \| undefined` |
| F | Lỗi | `void` không gán được cho `undefined` |
| G | Hợp lệ | Callback của `forEach` được khai báo trả về `void` |

1. Ở B, `void` nằm trong khai báo của chính hàm đó: đây là lời hứa "tôi không trả về gì", nên trả về giá trị là vi phạm. Ở C, `void` nằm trong kiểu của vị trí nhận hàm: nó có nghĩa "người gọi sẽ bỏ qua kết quả", nên hàm được gán vào muốn trả về gì cũng được.
2. TypeScript kiểm tra theo kiểu đã khai báo của `onDone`, tức là trả về `void`. `void` nghĩa là "không được dùng giá trị này", nên không gán được vào đâu, kể cả vào kiểu có chứa `undefined`.
3. Cùng lý do với C: `forEach` khai báo callback trả về `void` và bỏ qua mọi thứ callback trả về.

**Bài 4.2.**

1. Chú thích `: never` của `stop`. TypeScript hiểu rằng code sau lời gọi `stop(...)` không bao giờ chạy, nên sau khối `if`, `kelvin` chỉ còn có thể là `number`.
2. Kiểu suy luận là `void`, không phải `never`. Khi đó dòng A bị lỗi `'kelvin' is possibly 'undefined'`. Với khai báo hàm, muốn được coi là không bao giờ trả về thì phải ghi `: never` tường minh.
3. Lỗi ở chính dòng khai báo: hàm trả về `never` không được có điểm kết thúc chạy tới được. Khi `really` là `false`, hàm chạy hết thân và trả về bình thường.

**Bài 4.3.**

| Hàm | Kiểu trả về | Lý do |
| --- | --- | --- |
| `a` | `void` | Chỉ in ra, không trả về giá trị dùng được |
| `b` | `never` | Vòng lặp vô hạn, không bao giờ trả về |
| `c` | `string \| undefined` | Trả về mã tìm thấy, hoặc `undefined` khi không có |
| `d` | `never` | Luôn ném lỗi |

Không hàm nào trong bốn hàm nên ghi `undefined`: `a` không cam kết trả về giá trị nào cả, còn `c` có thể trả về chuỗi.

Kiểu của `onTick`:

```ts
function everySecond(onTick: (seconds: number) => void): void {
  // ...
}
```

### Phần 5

**Bài 5.1.**

1. Lỗi ở C, D, E. Các dòng A, B hợp lệ.
2. Khi kiểm tra một lời gọi, TypeScript chỉ nhìn vào các chữ ký overload. Chữ ký triển khai chỉ dùng cho phần thân hàm và không gọi trực tiếp được. Không có overload nào nhận một chuỗi đơn lẻ (C), cũng không có overload nào nhận số kèm `boolean` (D).
3. Không còn gì. Overload là cú pháp của hệ thống kiểu nên bị xoá khi biên dịch; chỉ còn lại một hàm `find(key, exact)`.

**Bài 5.2.**

1. Overload thứ ba của `toText` sai ở tham số: `values: string[]` không gán được cho tham số đầu tiên `number | boolean` của chữ ký triển khai.
2. Overload thứ hai của `size` sai ở kiểu trả về: nó hứa trả về `string` trong khi chữ ký triển khai trả về `number`.
3. Sửa `toText`:

```ts
function toText(value: number): string;
function toText(value: boolean): string;
function toText(values: string[], separator: string): string;
function toText(value: number | boolean | string[], separator?: string): string {
  if (typeof value === "number" || typeof value === "boolean") {
    return `${value}`;
  }
  return value.join(separator);
}
```

Sửa `size` bằng cách đổi overload thứ hai thành `function size(value: string[]): number;`.

**Bài 5.3.**

```ts
function pad(text: string, width = 10): string {
  return text.padEnd(width);
}

function len(value: string | string[]): number {
  return value.length;
}
```

`pad` chỉ khác nhau ở chỗ có hay không có tham số cuối, đúng việc của tham số mặc định. `len` nhận hai kiểu ở cùng một vị trí và trả về cùng một kiểu, đúng việc của union. `find` thì khác: kiểu của tham số thứ nhất quyết định tham số thứ hai có bắt buộc hay bị cấm. Mối ràng buộc giữa các tham số như vậy không diễn tả được bằng tham số tuỳ chọn hay union, nên mới cần overload.

### Phần 6

**Bài 6.** Một lời giải mẫu:

```ts
type PriceRule = (subtotal: number) => number;
type Receiver = (total: number) => void;

function reject(reason: string): never {
  throw new Error(`Đơn không hợp lệ: ${reason}`);
}

function sum(...prices: number[]): number {
  let result = 0;
  for (const price of prices) {
    result += price;
  }
  return result;
}

function percentOff(percent: number): PriceRule {
  return (subtotal) => subtotal * (1 - percent / 100);
}

function applyRules(subtotal: number, ...rules: PriceRule[]): number {
  let current = subtotal;
  for (const rule of rules) {
    current = rule(current);
  }
  return current;
}

function formatTotal(total: number): string;
function formatTotal(total: number, currency: string, rate: number): string;
function formatTotal(total: number, currency?: string, rate?: number): string {
  if (currency === undefined || rate === undefined) {
    return `${Math.round(total)} VND`;
  }
  return `${(total / rate).toFixed(2)} ${currency}`;
}

function checkout(prices: number[], onDone: Receiver, tip = 0): void {
  if (prices.length === 0) {
    reject("giỏ hàng trống");
  }
  const subtotal = sum(...prices);
  const shipping: PriceRule = (value) => (value >= 100000 ? value : value + 15000);
  const total = applyRules(subtotal, percentOff(10), shipping) + tip;
  onDone(total);
}
```

Kiểm tra số liệu của lời gọi đầu tiên: 25000 + 32000 + 45000 = 102000; giảm 10% còn 91800; dưới 100000 nên cộng 15000 thành 106800.

Câu hỏi kiểm tra: lỗi ở B, C, E, G, H. Các dòng A, D, F hợp lệ.

| Dòng | Kết quả | Lý do |
| --- | --- | --- |
| A | Hợp lệ | Rest parameter nhận được không đối số nào; kết quả là `0` |
| B | Lỗi | Truyền một mảng vào chỗ cần từng `number`; phải viết `sum(...[25000, 32000])` |
| C | Lỗi | `percentOff` là hàm tạo ra luật, chưa phải một `PriceRule`; nó trả về `PriceRule` chứ không trả về `number` |
| D | Hợp lệ | Cả hai đối số đều là `PriceRule`; `s` được suy luận là `number` |
| E | Lỗi | Không có overload nào nhận 2 đối số, chỉ có 1 hoặc 3 |
| F | Hợp lệ | `Receiver` trả về `void`, nên giá trị `total * 2` bị bỏ qua |
| G | Lỗi | Callback đòi 2 tham số, trong khi `Receiver` chỉ cung cấp 1 |
| H | Lỗi | `checkout` trả về `void`, không gán được cho `number` |

### Tự đánh giá

| Số bài làm đúng | Gợi ý |
| --- | --- |
| 16–18 | Nắm chắc chương, có thể sang Chương 6 |
| 11–15 | Xem lại phần sai nhiều nhất, làm lại sau một ngày |
| Dưới 11 | Đọc lại chương, chú ý mục Function Types và Void Returns |
