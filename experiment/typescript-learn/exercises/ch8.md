# Bài tập TypeScript — Chương 8: Classes (Intermediate)

Bộ bài tập luyện kiến thức Chương 8 "Classes" của sách *Learning TypeScript* (Josh Goldberg). Mọi ví dụ đều mới, không lấy từ sách.

**Bối cảnh.** Bạn là lập trình viên backend của ViXu, một ví điện tử. Mỗi bài là một việc có thật trong công việc: viết class theo đặc tả nghiệp vụ, sửa một pull request không biên dịch được, hoặc điều tra một sự cố trên production.

**Đề không nói bạn phải dùng tính năng nào của class.** Đề chỉ nêu yêu cầu nghiệp vụ và tiêu chí nghiệm thu. Chọn `readonly`, `private`, `abstract`, `static`, `implements` hay `extends` ở đâu là việc của bạn.

## Mục lục

- [Cách làm bài](#cách-làm-bài)
- [Bài 1 — Ví tiền](#bài-1--ví-tiền)
- [Bài 2 — Pull request: phiên OTP](#bài-2--pull-request-phiên-otp)
- [Bài 3 — Sự cố: bộ đếm request đứng yên](#bài-3--sự-cố-bộ-đếm-request-đứng-yên)
- [Bài 4 — Nhiều phương thức thanh toán](#bài-4--nhiều-phương-thức-thanh-toán)
- [Bài 5 — Các loại giao dịch và phí](#bài-5--các-loại-giao-dịch-và-phí)
- [Bài 6 — Pull request: mã giảm giá](#bài-6--pull-request-mã-giảm-giá)
- [Bài 7 — Kênh thông báo](#bài-7--kênh-thông-báo)
- [Bài 8 — Sinh mã giao dịch](#bài-8--sinh-mã-giao-dịch)
- [Bài 9 — Báo cáo bảo mật: sửa số dư từ console](#bài-9--báo-cáo-bảo-mật-sửa-số-dư-từ-console)
- [Bài 10 — Tổng hợp: sổ thu chi](#bài-10--tổng-hợp-sổ-thu-chi)
- [Gợi ý](#gợi-ý)
- [Đáp án và giải thích](#đáp-án-và-giải-thích)

## Cách làm bài

Bộ bài gồm 10 bài, làm trong khoảng 180 phút. Mọi đoạn code giả định bật `strict` trong `tsconfig.json`.

Mỗi bài viết code có tối đa ba phần:

- **Yêu cầu:** mô tả nghiệp vụ. Tên class và tên method được cho sẵn để đoạn nghiệm thu chạy được; mọi thứ khác do bạn quyết định.
- **Nghiệm thu:** một đoạn code dùng class của bạn, kèm kết quả phải in ra. Code của bạn đúng khi đoạn này biên dịch được và in ra đúng từng dòng.
- **Phải bị chặn:** các dòng code mà trình biên dịch phải báo lỗi. Nếu một dòng trong danh sách này biên dịch được thì thiết kế của bạn chưa đạt.

Quy tắc chung:

- Không dùng `any`, `as`, toán tử `!`, hay `// @ts-ignore`.
- Mục [Gợi ý](#gợi-ý) có một dòng cho mỗi bài. Chỉ đọc khi đã thử ít nhất 10 phút mà chưa có hướng.
- Đáp án ở cuối file.

| Bài | Dạng | Thời gian gợi ý |
| --- | --- | --- |
| 1. Ví tiền | Viết class | 15 phút |
| 2. Phiên OTP | Sửa pull request | 15 phút |
| 3. Bộ đếm request | Điều tra sự cố | 10 phút |
| 4. Phương thức thanh toán | Viết class | 20 phút |
| 5. Giao dịch và phí | Viết class | 25 phút |
| 6. Mã giảm giá | Sửa pull request | 15 phút |
| 7. Kênh thông báo | Viết class | 25 phút |
| 8. Sinh mã giao dịch | Viết class | 10 phút |
| 9. Báo cáo bảo mật | Điều tra sự cố | 10 phút |
| 10. Sổ thu chi | Tổng hợp | 35 phút |

## Bài 1 — Ví tiền

**Yêu cầu.** Viết class `Wallet`.

- Một ví được tạo từ mã ví và tên chủ ví: `new Wallet("W-1", "Thu Hà")`. Cả hai đều bắt buộc.
- Mã ví `id` đọc được từ bên ngoài. Sau khi ví được tạo, không nơi nào gán lại được mã ví.
- Tên chủ ví `ownerName` đọc được và đổi được.
- Tên gợi nhớ `nickname` không bắt buộc. Người dùng có thể đặt sau khi tạo ví, hoặc không bao giờ đặt.
- Số dư bắt đầu từ 0. Bên ngoài chỉ xem được số dư qua `getBalance()`, và chỉ làm số dư thay đổi được qua `deposit` và `withdraw`.
- `deposit(amount)` cộng tiền và trả về số dư mới. Nếu `amount` không lớn hơn 0 thì ném `Error("Số tiền phải lớn hơn 0")`.
- `withdraw(amount)` trừ tiền và trả về số dư mới. Kiểm tra `amount` như `deposit`. Nếu rút nhiều hơn số dư thì ném `Error("Số dư không đủ")`.
- `label()` trả về tên gợi nhớ nếu có, ngược lại trả về `"Ví của <tên chủ ví>"`.

**Nghiệm thu.**

```ts
const wallet = new Wallet("W-1", "Thu Hà");
console.log(wallet.label());            // Ví của Thu Hà
console.log(wallet.deposit(200000));    // 200000
console.log(wallet.withdraw(50000));    // 150000
wallet.nickname = "Ví đi chợ";
console.log(wallet.label());            // Ví đi chợ
console.log(wallet.getBalance());       // 150000

wallet.withdraw(1000000);               // ném Error: Số dư không đủ
wallet.deposit(0);                      // ném Error: Số tiền phải lớn hơn 0
```

**Phải bị chặn.**

```ts
wallet.id = "W-2";
wallet.balance = 999999999;
wallet.deposit("50000");
new Wallet("W-3");
wallet.nickname.toUpperCase();
wallet.topUp(1000);
```

**Câu hỏi.** Mã ví và số dư đều "không được sửa từ bên ngoài". Vì sao không thể bảo vệ hai thứ đó bằng cùng một cách?

## Bài 2 — Pull request: phiên OTP

Một đồng nghiệp mở pull request thêm class quản lý phiên xác thực OTP. CI báo 5 lỗi biên dịch.

```ts
class OtpSession {
  phone: string;
  code: string;
  attempts: number;
  readonly maxAttempts = 3;
  verifiedAt?: Date;

  constructor(phone: string) {
    this.phone = phone;
    this.createdAt = Date.now();
  }

  generate() {
    this.code = String(Math.floor(100000 + Math.random() * 900000));
  }

  verify(input: string): boolean {
    if (this.attempts >= this.maxAttempts) {
      return false;
    }
    this.attempts += 1;
    if (input === this.code) {
      this.verifiedAt = new Date();
      return true;
    }
    return false;
  }

  extendLimit() {
    this.maxAttempts = 5;
  }

  verifiedYear(): number {
    return this.verifiedAt.getFullYear();
  }
}
```

Hành vi đã chốt với nhóm sản phẩm:

1. Mã OTP 6 chữ số được sinh ngay khi phiên được tạo. Không tồn tại trạng thái "phiên chưa có mã".
2. Phiên ghi lại thời điểm tạo (`createdAt`, tính bằng mili giây) và thời điểm đó không đổi.
3. Mỗi phiên được thử tối đa 3 lần. Không có cách nào nới giới hạn này.
4. `verifiedYear()` trả về năm xác thực, hoặc `undefined` nếu phiên chưa được xác thực.

**Việc cần làm.**

1. Tìm 5 lỗi biên dịch và nêu nguyên nhân của từng lỗi.
2. Sửa class để hết lỗi và đúng cả bốn hành vi trên.
3. Lỗi ở dòng `code: string;` có thể làm biến mất bằng cách thêm đúng một ký tự vào dòng đó. Cách đó là gì, và vì sao nó không đáp ứng hành vi số 1?
4. Trước khi sửa, giả sử tắt kiểm tra để code chạy được. Gọi `new OtpSession("0901234567").verify("123456")` trả về gì, và điều đó có nghĩa gì với người dùng?

## Bài 3 — Sự cố: bộ đếm request đứng yên

Dashboard giám sát cho thấy số request luôn bằng 0, và log server đầy dòng `TypeError: Cannot read properties of undefined (reading 'count')`. Code liên quan biên dịch không có lỗi nào.

```ts
class RequestCounter {
  count = 0;

  record() {
    this.count += 1;
  }
}

// Hàm của framework, không sửa được
function onEveryRequest(handler: () => void) {
  handler();
  handler();
}

const counter = new RequestCounter();
onEveryRequest(counter.record);
console.log(counter.count);
```

**Việc cần làm.**

1. Giải thích vì sao lỗi xảy ra lúc chạy.
2. Vì sao TypeScript không phát hiện ra?
3. Sửa lỗi. Chỉ được sửa bên trong class `RequestCounter`; dòng `onEveryRequest(counter.record)` phải giữ nguyên. Sau khi sửa, chương trình in ra `2`.
4. Với class ban đầu, `new RequestCounter().record === new RequestCounter().record` cho kết quả gì? Với class sau khi sửa thì sao? Khác biệt đó có ý nghĩa gì khi hệ thống tạo ra hàng triệu instance?

## Bài 4 — Nhiều phương thức thanh toán

ViXu cho người dùng thanh toán bằng nhiều nguồn tiền. Nhóm đã thống nhất hợp đồng chung sau đây và không được sửa nó:

```ts
interface PaymentProvider {
  readonly name: string;
  readonly feePercent: number;
  canPay(amount: number): boolean;
  pay(amount: number): string;
}
```

**Yêu cầu.** Viết hai class tuân theo hợp đồng trên và một hàm.

`BankTransferProvider`:

- Tên là `"Chuyển khoản"`, phí 0%.
- Thanh toán được mọi số tiền lớn hơn 0 và không quá 50.000.000.
- `pay(amount)` trả về mã tham chiếu `"BANK-<amount>"`. Nếu số tiền không thanh toán được thì ném `Error("Chuyển khoản không xử lý được số tiền này")`.

`CardProvider`:

- Tên là `"Thẻ"`, phí 2%. Phí của một lần thanh toán được làm tròn tới đồng.
- Được tạo với một hạn mức: `new CardProvider(1000000)`.
- Thanh toán được khi số tiền lớn hơn 0 và số tiền cộng phí không vượt hạn mức còn lại.
- `pay(amount)` trừ số tiền cộng phí vào hạn mức còn lại, rồi trả về `"CARD-<amount>"`. Nếu không thanh toán được thì ném `Error("Thẻ không đủ hạn mức")`.
- `getRemaining()` trả về hạn mức còn lại. Bên ngoài không có cách nào khác để đọc hay sửa hạn mức.

`payWithFirstAvailable(providers, amount)`:

- Nhận một danh sách phương thức thanh toán theo thứ tự ưu tiên và một số tiền.
- Dùng phương thức đầu tiên thanh toán được và trả về mã tham chiếu của nó.
- Nếu không phương thức nào thanh toán được thì ném `Error("Không có phương thức thanh toán phù hợp")`.

**Nghiệm thu.**

```ts
const card = new CardProvider(1000000);
const bank = new BankTransferProvider();

console.log(payWithFirstAvailable([card, bank], 400000));   // CARD-400000
console.log(card.getRemaining());                           // 592000
console.log(payWithFirstAvailable([card, bank], 600000));   // BANK-600000
console.log(payWithFirstAvailable([card, bank], 500000));   // CARD-500000
console.log(card.getRemaining());                           // 82000

payWithFirstAvailable([card, bank], 90000000);   // ném Error: Không có phương thức thanh toán phù hợp
card.pay(90000);                                 // ném Error: Thẻ không đủ hạn mức
```

**Phải bị chặn.**

```ts
card.remaining = 999999999;
bank.feePercent = 5;
payWithFirstAvailable([card, "bank"], 1000);
```

**Câu hỏi.**

1. Trong file test, một đồng nghiệp truyền vào một object thường thay vì instance của class, và nó biên dịch được. Vì sao?

```ts
const fake = {
  name: "Giả lập",
  feePercent: 0,
  canPay: () => true,
  pay: (amount: number) => `TEST-${amount}`,
};
console.log(payWithFirstAvailable([fake], 1));   // TEST-1
```

2. Nếu xoá cụm từ nối `CardProvider` với `PaymentProvider` trong khai báo class, lời gọi `payWithFirstAvailable([card, bank], 400000)` còn biên dịch được không? Vậy cụm từ đó đem lại lợi ích gì?
3. Một đồng nghiệp viết class thứ ba như sau và lập luận: "interface đã ghi `amount: number` rồi, class không cần ghi lại". Trình biên dịch phản hồi thế nào?

```ts
class WalletBalanceProvider implements PaymentProvider {
  readonly name = "Số dư ví";
  readonly feePercent = 0;
  canPay(amount) {
    return amount > 0;
  }
  pay(amount) {
    return `WALLET-${amount}`;
  }
}
```

## Bài 5 — Các loại giao dịch và phí

**Yêu cầu.** Viết bốn class và một hàm cho module giao dịch.

Mọi giao dịch đều có:

- Mã giao dịch `id` và số tiền `amount`. Cả hai đọc được từ bên ngoài và không đổi sau khi tạo.
- Số tiền phải lớn hơn 0; nếu không, việc tạo giao dịch ném `Error("Số tiền phải lớn hơn 0")`. Quy tắc này chỉ được viết ở một nơi trong code.
- `fee()` trả về phí, `total()` trả về số tiền cộng phí, `describe()` trả về một dòng mô tả.

| Class | Cách tạo | Phí | `describe()` |
| --- | --- | --- | --- |
| `Transaction` | `new Transaction(id, amount)` | 0 | `<id>: <amount>đ` |
| `TopUp` | `new TopUp(id, amount, source)` | 0 | `<id>: nạp <amount>đ từ <source>` |
| `Transfer` | `new Transfer(id, amount, toWalletId)` | 0,5% số tiền, làm tròn tới đồng, tối thiểu 1000, tối đa 10000 | `<id>: chuyển <amount>đ tới <toWalletId>, phí <phí>đ` |
| `Withdrawal` | `new Withdrawal(id, amount)` | Cố định 3300 | Dòng mô tả của `Transaction`, nối thêm ` (rút về ngân hàng, phí 3300đ)` |

Ràng buộc thiết kế:

- `TopUp`, `Transfer`, `Withdrawal` dùng được ở mọi nơi cần một `Transaction`.
- `total()` chỉ được viết một lần trong toàn bộ code.
- `Withdrawal.describe()` không được chép lại chuỗi định dạng của `Transaction.describe()`. Nếu sau này định dạng gốc đổi, mô tả của `Withdrawal` phải đổi theo.

`totalFees(transactions)` nhận một danh sách giao dịch và trả về tổng phí. Hàm này không được kiểm tra từng giao dịch thuộc loại nào: khi nhóm thêm loại giao dịch thứ năm, `totalFees` không phải sửa.

**Nghiệm thu.**

```ts
const list: Transaction[] = [
  new TopUp("TX-1", 500000, "Vietcombank"),
  new Transfer("TX-2", 100000, "W-9"),
  new Transfer("TX-3", 800000, "W-9"),
  new Transfer("TX-4", 5000000, "W-4"),
  new Withdrawal("TX-5", 200000),
];

for (const transaction of list) {
  console.log(transaction.describe(), "|", transaction.total());
}
// TX-1: nạp 500000đ từ Vietcombank | 500000
// TX-2: chuyển 100000đ tới W-9, phí 1000đ | 101000
// TX-3: chuyển 800000đ tới W-9, phí 4000đ | 804000
// TX-4: chuyển 5000000đ tới W-4, phí 10000đ | 5010000
// TX-5: 200000đ (rút về ngân hàng, phí 3300đ) | 203300

console.log(totalFees(list));   // 18300

new Transfer("TX-6", 0, "W-1");   // ném Error: Số tiền phải lớn hơn 0
```

**Phải bị chặn.**

```ts
list[0].amount = 1;
new Transfer("TX-7", 50000);
list[1].toWalletId;
```

**Câu hỏi.**

1. Dòng `list[1].toWalletId` bị chặn dù phần tử đó đúng là một `Transfer`. Vì sao?
2. Trong hai dòng sau, một dòng biên dịch được và một dòng không. Dòng nào, và vì sao? Dòng biên dịch được có tiềm ẩn rủi ro gì?

```ts
const first: Withdrawal = new Transaction("TX-8", 1000);
const second: Transfer = new Transaction("TX-9", 1000);
```

## Bài 6 — Pull request: mã giảm giá

Một đồng nghiệp mở pull request thêm ba loại mã giảm giá. Class `Voucher` và hàm `checkout` đã chạy trên production từ lâu và không được sửa. Pull request có 5 chỗ sai, khiến trình biên dịch báo 6 lỗi.

```ts
// Code đang chạy trên production — không sửa
class Voucher {
  code: string;
  percent: number;

  constructor(code: string, percent: number) {
    this.code = code;
    this.percent = percent;
  }

  apply(amount: number): number {
    return amount * (1 - this.percent / 100);
  }

  isValid(): boolean {
    return true;
  }
}

function checkout(amount: number, voucher: Voucher): number {
  return voucher.isValid() ? voucher.apply(amount) : amount;
}

// Phần thêm mới trong pull request
class CappedVoucher extends Voucher {
  maxDiscount: number;

  constructor(code: string, percent: number, maxDiscount: number) {
    this.maxDiscount = maxDiscount;
    super(code, percent);
  }

  apply(amount: number): string {
    const discount = Math.min((amount * this.percent) / 100, this.maxDiscount);
    return `${amount - discount}đ`;
  }
}

class ExpiringVoucher extends Voucher {
  expiresAt: Date;

  constructor(code: string, expiresAt: Date) {
    this.expiresAt = expiresAt;
  }

  isValid(now: Date): boolean {
    return now < this.expiresAt;
  }
}

class FreeShipVoucher extends Voucher {
  percent = "100%";
}
```

Ý định ghi trong mô tả pull request:

- `CappedVoucher`: giảm theo phần trăm, nhưng số tiền giảm không vượt quá `maxDiscount`.
- `ExpiringVoucher`: giảm theo phần trăm như voucher thường, nhưng chỉ hợp lệ trước thời điểm `expiresAt`.
- `FreeShipVoucher`: tạo chỉ bằng mã, luôn giảm 100%.

**Việc cần làm.**

1. Tìm 5 chỗ sai.
2. Với mỗi chỗ sai liên quan tới `apply`, `isValid` và `percent`: nếu trình biên dịch không chặn, hàm `checkout` sẽ gặp chuyện gì lúc chạy?
3. Sửa ba class để hết lỗi và đúng ý định. Sau khi sửa:

```ts
console.log(checkout(500000, new CappedVoucher("GIAM20", 20, 50000)));                       // 450000
console.log(checkout(500000, new ExpiringVoucher("TET", 10, new Date("2020-01-01"))));       // 500000
console.log(checkout(30000, new FreeShipVoucher("SHIP")));                                   // 0
```

## Bài 7 — Kênh thông báo

ViXu gửi thông báo qua SMS, push và email. Ba kênh hiện là ba đoạn code chép lại của nhau, và tháng trước kênh push quên bước kiểm tra nội dung rỗng nên đã gửi thông báo trắng cho người dùng. Bạn được giao viết lại.

**Yêu cầu.**

Mọi kênh đều gửi theo đúng một quy trình, nằm trong `send(to, message)`:

1. Cắt khoảng trắng ở hai đầu nội dung.
2. Nếu nội dung rỗng thì không gửi và trả về `false`.
3. Nếu nội dung dài hơn giới hạn của kênh, giữ lại `giới hạn − 1` ký tự đầu rồi nối thêm ký tự `…`.
4. Thực hiện bước gửi thật của kênh.
5. Tăng bộ đếm số thông báo đã gửi của kênh đó, rồi trả về `true`.

Các kênh chỉ khác nhau ở giới hạn độ dài và ở bước gửi thật:

| Class | Cách tạo | Giới hạn | Bước gửi thật in ra |
| --- | --- | --- | --- |
| `SmsNotifier` | `new SmsNotifier()` | 160 | `[SMS → <to>] <nội dung>` |
| `PushNotifier` | `new PushNotifier()` | 40 | `[Push → <to>] <nội dung>` |
| `EmailNotifier` | `new EmailNotifier(from)` | 10000 | `[Email <from> → <to>] <nội dung>` |

Ràng buộc thiết kế:

- Quy trình năm bước chỉ được viết một lần. Mọi kênh dùng chung một kiểu `Notifier`.
- Người viết kênh mới không thể quên cung cấp giới hạn độ dài hay bước gửi thật: quên thì code không biên dịch được.
- Không tạo được một "kênh chung chung" không thuộc loại nào.
- `getSentCount()` trả về số thông báo kênh đó đã gửi. Không code nào bên ngoài sửa được con số này, kể cả code của các kênh cụ thể.
- Bên ngoài chỉ gửi được qua `send`. Không gọi thẳng được bước gửi thật, vì như vậy sẽ bỏ qua bước kiểm tra.

`notifyAll(channels, to, message)` gửi cùng một nội dung qua mọi kênh trong danh sách và trả về số kênh đã gửi thành công.

**Nghiệm thu.**

```ts
const sms = new SmsNotifier();
const push = new PushNotifier();
const email = new EmailNotifier("no-reply@vixu.test");

const message = "  Bạn vừa nhận 500.000đ từ Trần Thu Hà. Số dư hiện tại: 1.250.000đ.  ";
console.log(notifyAll([sms, push, email], "ha", message));
// [SMS → ha] Bạn vừa nhận 500.000đ từ Trần Thu Hà. Số dư hiện tại: 1.250.000đ.
// [Push → ha] Bạn vừa nhận 500.000đ từ Trần Thu Hà. S…
// [Email no-reply@vixu.test → ha] Bạn vừa nhận 500.000đ từ Trần Thu Hà. Số dư hiện tại: 1.250.000đ.
// 3

console.log(sms.send("0901234567", "   "));   // false
console.log(sms.getSentCount(), push.getSentCount(), email.getSentCount());   // 1 1 1
```

**Phải bị chặn.** Thay `<bước gửi thật>` và `<bộ đếm>` bằng tên bạn đã đặt.

```ts
new Notifier();
sms.<bộ đếm> = 1000;
sms.<bước gửi thật>("0901234567", "bỏ qua kiểm tra");

// Một kênh mới chỉ khai báo giới hạn độ dài mà không có bước gửi thật
class ZaloNotifier extends Notifier { /* chỉ có giới hạn độ dài */ }

// Một kênh cụ thể tự sửa bộ đếm của mình từ bên trong
class CheatingNotifier extends Notifier { /* ... gán this.<bộ đếm> = 5 ở đâu đó */ }
```

## Bài 8 — Sinh mã giao dịch

**Yêu cầu.** Viết class `TxId` sinh mã giao dịch cho toàn hệ thống.

- `TxId.next()` trả về mã kế tiếp: `"TX-000001"`, rồi `"TX-000002"`, và cứ thế. Phần số luôn có 6 chữ số.
- `TxId.issued()` trả về số mã đã cấp.
- `TxId.PREFIX` đọc được từ bên ngoài và có giá trị `"TX"`.
- Cả hệ thống dùng chung một dãy số. Không cần tạo instance nào để lấy mã.
- Không code nào bên ngoài class đặt lại được dãy số hay đổi được tiền tố.

**Nghiệm thu.**

```ts
console.log(TxId.next());     // TX-000001
console.log(TxId.next());     // TX-000002
console.log(TxId.next());     // TX-000003
console.log(TxId.issued());   // 3
console.log(TxId.PREFIX);     // TX
```

**Phải bị chặn.** Thay `<bộ đếm>` bằng tên bạn đã đặt.

```ts
TxId.<bộ đếm> = 0;
TxId.PREFIX = "HACK";
new TxId().next();
```

**Câu hỏi.** Khi một thành viên của class cần đồng thời nhiều từ khoá bổ nghĩa, chúng phải viết theo thứ tự nào?

## Bài 9 — Báo cáo bảo mật: sửa số dư từ console

Đội bảo mật gửi báo cáo: trên bản web, mở console của trình duyệt và gõ một dòng là sửa được số dư đang hiển thị. Class liên quan được viết bằng TypeScript và đã qua review:

```ts
class SoftWallet {
  private balance = 0;

  getBalance(): number {
    return this.balance;
  }
}
```

Dòng đội bảo mật đã gõ trong console, với `wallet` là một instance của `SoftWallet`:

```js
wallet.balance = 1000000000;
wallet.getBalance();   // 1000000000
```

**Việc cần làm.**

1. `balance` đã được bảo vệ trong TypeScript. Vì sao dòng trên vẫn chạy được trong trình duyệt?
2. Viết lại class thành `HardWallet` sao cho việc bảo vệ còn nguyên lúc chạy: sau khi gõ dòng trên trong console, `getBalance()` vẫn trả về `0`.
3. Với cách của bạn, có thêm được từ khoá `private` vào trước thuộc tính đó không? Chuyện gì xảy ra nếu thử?
4. Cùng lý do ở câu 1 còn áp dụng cho từ khoá nào khác của class mà bạn đã dùng ở Bài 1?
5. Giả sử đã sửa xong. Số dư hiển thị trên web giờ đã "an toàn" theo nghĩa nào, và vẫn chưa an toàn theo nghĩa nào?

## Bài 10 — Tổng hợp: sổ thu chi

ViXu ra mắt tính năng sổ thu chi cá nhân. Bạn viết phần lõi.

**Yêu cầu.**

Một khoản ghi sổ (`Entry`) là một khoản thu (`Income`) hoặc một khoản chi (`Expense`). Không tồn tại khoản ghi sổ nào không thuộc một trong các loại cụ thể.

- Cách tạo: `new Income(amount)` và `new Expense(amount, category)`.
- Số tiền phải lớn hơn 0; nếu không thì ném `Error("Số tiền phải lớn hơn 0")`.
- Mỗi khoản tự nhận một mã `id` khi được tạo: `"E-1"`, `"E-2"`, và cứ thế, đánh số chung cho mọi loại khoản trong toàn chương trình. Người tạo không truyền mã vào.
- `id` và `amount` đọc được từ bên ngoài và không đổi sau khi tạo. Với khoản chi, `category` cũng vậy.
- `note` là ghi chú không bắt buộc, đặt sau khi tạo.
- `signedAmount()` trả về số tiền kèm dấu: dương với khoản thu, âm với khoản chi.
- `label()` trả về `"thu"` với khoản thu, và `"chi:<category>"` với khoản chi.
- `toCsvRow()` trả về `"<id>,<label>,<signedAmount>,<note>"`. Khi không có ghi chú thì phần cuối để trống. Định dạng này chỉ được viết một lần.
- Người viết loại khoản mới không thể quên `signedAmount` hay `label`.

Một sổ (`Ledger`) thuộc về một người và chứa các khoản ghi sổ.

- Cách tạo: `new Ledger(owner)`. Tên chủ sổ đọc được và không đổi.
- `add(entry)` thêm một khoản vào sổ. Nếu thêm xong mà số dư âm thì không thêm và ném `Error("Không đủ số dư")`.
- `balance()` trả về tổng các số tiền kèm dấu. `count()` trả về số khoản trong sổ.
- `exportCsv()` trả về một mảng chuỗi: dòng tiêu đề `"id,loại,số tiền,ghi chú"`, rồi mỗi khoản một dòng.
- `toCsvRow()` của sổ trả về `"<owner>,<count>,<balance>"`.
- Bên ngoài không lấy được danh sách khoản để tự thêm, xoá hay thay thế. Mọi thay đổi phải qua `add`.

Hàm `toCsv(items)` nhận một danh sách gồm bất kỳ thứ gì xuất được ra một dòng CSV, kể cả sổ lẫn khoản ghi sổ trộn với nhau, và trả về mảng các dòng. Hàm này không được biết tới `Entry` hay `Ledger`.

**Nghiệm thu.** Chạy đoạn này ở đầu chương trình, trước khi tạo bất kỳ khoản ghi sổ nào khác.

```ts
const ledger = new Ledger("Thu Hà");

const salary = new Income(15000000);
salary.note = "lương tháng 10";
ledger.add(salary);
ledger.add(new Expense(4500000, "nhà"));

const coffee = new Expense(45000, "ăn uống");
coffee.note = "cà phê";
ledger.add(coffee);

console.log(ledger.balance());   // 10455000
console.log(ledger.count());     // 3

ledger.add(new Expense(20000000, "xe"));   // ném Error: Không đủ số dư
console.log(ledger.count());     // 3

console.log(ledger.exportCsv());
// [
//   'id,loại,số tiền,ghi chú',
//   'E-1,thu,15000000,lương tháng 10',
//   'E-2,chi:nhà,-4500000,',
//   'E-3,chi:ăn uống,-45000,cà phê'
// ]

console.log(toCsv([ledger, salary, new Income(200000)]));
// [ 'Thu Hà,3,10455000', 'E-1,thu,15000000,lương tháng 10', 'E-5,thu,200000,' ]

new Income(-5);   // ném Error: Số tiền phải lớn hơn 0
```

**Phải bị chặn.** Thay `<danh sách>` và `<bộ đếm>` bằng tên bạn đã đặt.

```ts
new Entry(1000);
salary.amount = 99;
salary.id = "E-999";
Entry.<bộ đếm> = 1;
ledger.<danh sách>.push(salary);
ledger.<danh sách> = [];
ledger.owner = "Người khác";
new Expense(45000);
salary.note.trim();

// Một loại khoản mới chỉ có label mà thiếu signedAmount
class Refund extends Entry { label(): string { return "hoàn"; } }
```

**Câu hỏi.**

1. Trong kết quả nghiệm thu, khoản thu cuối cùng mang mã `E-5` chứ không phải `E-4`. Mã `E-4` đã đi đâu? Đó có phải lỗi không?
2. `toCsv` nhận được cả `Ledger` lẫn `Income` trong cùng một mảng dù hai class này không có quan hệ kế thừa. Điều gì cho phép việc đó?
3. Sổ không cho bên ngoài lấy danh sách khoản. Nhưng `salary` vẫn là một biến bên ngoài đang trỏ tới một khoản nằm trong sổ. Bên ngoài còn sửa được gì trên khoản đó, và việc ấy có làm sai số dư của sổ không?

## Gợi ý

Mỗi bài một dòng, chỉ nêu phần của chương nên đọc lại. Không có lời giải ở đây.

| Bài | Đọc lại mục |
| --- | --- |
| 1 | Read-Only Properties; Optional Properties; Member Visibility |
| 2 | Class Properties; Initialization Checking; Read-Only Properties |
| 3 | Function Properties |
| 4 | Classes and Interfaces; Classes as Types |
| 5 | Extending a Class; Overridden Constructors; Overridden Methods; Extension Assignability |
| 6 | Overridden Constructors; Overridden Methods; Overridden Properties |
| 7 | Abstract Classes; Member Visibility |
| 8 | Static Field Modifiers |
| 9 | Member Visibility, đoạn so sánh với `#` của JavaScript |
| 10 | Tất cả các mục trên |

## Đáp án và giải thích

Mọi lời giải dưới đây đã được biên dịch với `strict` bật và chạy ra đúng kết quả nghiệm thu. Lời giải của bạn có thể khác về tên thuộc tính nội bộ mà vẫn đúng, miễn là qua được cả ba phần Nghiệm thu, Phải bị chặn và các ràng buộc thiết kế.

### Bài 1

```ts
class Wallet {
  readonly id: string;
  ownerName: string;
  nickname?: string;
  private balance = 0;

  constructor(id: string, ownerName: string) {
    this.id = id;
    this.ownerName = ownerName;
  }

  getBalance(): number {
    return this.balance;
  }

  deposit(amount: number): number {
    if (amount <= 0) {
      throw new Error("Số tiền phải lớn hơn 0");
    }
    this.balance += amount;
    return this.balance;
  }

  withdraw(amount: number): number {
    if (amount <= 0) {
      throw new Error("Số tiền phải lớn hơn 0");
    }
    if (amount > this.balance) {
      throw new Error("Số dư không đủ");
    }
    this.balance -= amount;
    return this.balance;
  }

  label(): string {
    return this.nickname === undefined ? `Ví của ${this.ownerName}` : this.nickname;
  }
}
```

Lý do từng dòng trong "Phải bị chặn" bị chặn:

| Dòng | Lý do |
| --- | --- |
| `wallet.id = "W-2"` | `id` là `readonly` |
| `wallet.balance = 999999999` | `balance` là `private` |
| `wallet.deposit("50000")` | Tham số là `number` |
| `new Wallet("W-3")` | Constructor cần 2 đối số |
| `wallet.nickname.toUpperCase()` | `nickname` có thể là `undefined` |
| `wallet.topUp(1000)` | Class không khai báo `topUp` |

Câu hỏi: `readonly` cấm gán lại ở mọi nơi ngoài constructor, kể cả trong method của chính class. Mã ví không bao giờ đổi nên hợp với `readonly`. Số dư thì phải đổi được trong `deposit` và `withdraw`, nên không thể `readonly`; thứ nó cần là giới hạn ai được chạm vào, tức `private`. `readonly` trả lời câu hỏi "có đổi được không", `private` trả lời câu hỏi "ai được truy cập".

### Bài 2

Năm lỗi:

| Vị trí | Nguyên nhân |
| --- | --- |
| `code: string;` | Không có giá trị khởi tạo và không được gán trong constructor |
| `attempts: number;` | Cùng nguyên nhân |
| `this.createdAt = ...` | Class không khai báo thuộc tính `createdAt` |
| `this.maxAttempts = 5` | Gán lại thuộc tính `readonly` ngoài constructor |
| `this.verifiedAt.getFullYear()` | `verifiedAt` là thuộc tính tuỳ chọn, có thể là `undefined` |

Class sau khi sửa:

```ts
class OtpSession {
  phone: string;
  code: string;
  attempts = 0;
  readonly maxAttempts = 3;
  readonly createdAt: number;
  verifiedAt?: Date;

  constructor(phone: string) {
    this.phone = phone;
    this.createdAt = Date.now();
    this.code = String(Math.floor(100000 + Math.random() * 900000));
  }

  verify(input: string): boolean {
    if (this.attempts >= this.maxAttempts) {
      return false;
    }
    this.attempts += 1;
    if (input === this.code) {
      this.verifiedAt = new Date();
      return true;
    }
    return false;
  }

  verifiedYear(): number | undefined {
    return this.verifiedAt === undefined ? undefined : this.verifiedAt.getFullYear();
  }
}
```

Các quyết định đáng chú ý: method `generate` bị bỏ và việc sinh mã chuyển vào constructor, để đúng hành vi số 1. Method `extendLimit` bị xoá hẳn chứ không sửa, vì hành vi số 3 nói không có cách nào nới giới hạn. `createdAt` được khai báo `readonly` theo hành vi số 2.

Câu 3: thêm `!` thành `code!: string;`. Ký tự đó chỉ tắt việc kiểm tra khởi tạo cho thuộc tính này. Nó không làm cho mã được sinh ra: một phiên vừa tạo mà chưa ai gọi `generate()` vẫn có `code` là `undefined`, đúng cái trạng thái mà hành vi số 1 cấm.

Câu 4: trả về `false`, nhưng vì lý do sai. `attempts` là `undefined`, nên `undefined >= 3` là `false`, rồi `undefined + 1` thành `NaN`. Từ đó `NaN >= 3` luôn là `false`, tức giới hạn 3 lần thử không bao giờ có tác dụng: kẻ tấn công được thử mã OTP không giới hạn số lần. Đây là lỗi bảo mật mà việc kiểm tra khởi tạo đã chặn ngay từ lúc biên dịch.

### Bài 3

1. `counter.record` lấy hàm ra khỏi object. Khi `onEveryRequest` gọi `handler()`, hàm chạy mà không gắn với object nào, nên `this` là `undefined` và `this.count` ném `TypeError`. Lỗi xảy ra ở lần gọi đầu tiên, nên `count` vẫn là 0.
2. Về kiểu, `counter.record` là một hàm không tham số và trả về `void`, khớp hoàn toàn với `() => void`. Hệ thống kiểu ở đây chỉ kiểm tra hình dạng của hàm, không theo dõi `this` sẽ là gì lúc hàm được gọi.
3. Đổi method thành thuộc tính chứa arrow function. Arrow function giữ `this` của instance tại thời điểm nó được tạo:

```ts
class RequestCounter {
  count = 0;

  record = () => {
    this.count += 1;
  };
}
```

4. Class ban đầu: `true`. Method nằm trên prototype nên mọi instance dùng chung một hàm. Class sau khi sửa: `false`. Mỗi instance có một hàm riêng được tạo lúc khởi tạo. Với hàng triệu instance, đó là hàng triệu hàm chiếm bộ nhớ. Vì vậy chỉ nên dùng cách này cho những hàm thật sự được truyền đi như callback.

### Bài 4

```ts
class BankTransferProvider implements PaymentProvider {
  readonly name = "Chuyển khoản";
  readonly feePercent = 0;

  canPay(amount: number): boolean {
    return amount > 0 && amount <= 50_000_000;
  }

  pay(amount: number): string {
    if (!this.canPay(amount)) {
      throw new Error("Chuyển khoản không xử lý được số tiền này");
    }
    return `BANK-${amount}`;
  }
}

class CardProvider implements PaymentProvider {
  readonly name = "Thẻ";
  readonly feePercent = 2;
  private remaining: number;

  constructor(creditLimit: number) {
    this.remaining = creditLimit;
  }

  private totalWithFee(amount: number): number {
    return amount + Math.round((amount * this.feePercent) / 100);
  }

  canPay(amount: number): boolean {
    return amount > 0 && this.totalWithFee(amount) <= this.remaining;
  }

  pay(amount: number): string {
    if (!this.canPay(amount)) {
      throw new Error("Thẻ không đủ hạn mức");
    }
    this.remaining -= this.totalWithFee(amount);
    return `CARD-${amount}`;
  }

  getRemaining(): number {
    return this.remaining;
  }
}

function payWithFirstAvailable(providers: PaymentProvider[], amount: number): string {
  for (const provider of providers) {
    if (provider.canPay(amount)) {
      return provider.pay(amount);
    }
  }
  throw new Error("Không có phương thức thanh toán phù hợp");
}
```

Kiểm tra số liệu: 400000 cộng phí 8000 là 408000, hạn mức còn 592000. Lần thanh toán 600000 cần 612000 nên thẻ từ chối và chuyển khoản nhận. Lần 500000 cần 510000, còn lại 82000.

Tham số của `payWithFirstAvailable` có kiểu là interface chứ không phải một class cụ thể. Nhờ đó hàm nhận được mọi phương thức thanh toán, kể cả những class sẽ viết sau này.

Câu hỏi:

1. TypeScript so sánh theo cấu trúc. Object `fake` có đủ bốn thành viên với kiểu khớp nên được coi là một `PaymentProvider`, bất kể nó được tạo bằng cách nào.
2. Vẫn biên dịch được, cũng vì so sánh theo cấu trúc. `implements` không thay đổi cách class được dùng. Lợi ích của nó là báo lỗi sớm và đúng chỗ: nếu class thiếu một thành viên hoặc sai kiểu, lỗi hiện ngay tại khai báo class, thay vì hiện ở một nơi xa nào đó đang truyền instance vào hàm.
3. Báo hai lỗi "Parameter 'amount' implicitly has an 'any' type". `implements` chỉ kiểm tra class có khớp interface hay không; nó không chép kiểu từ interface sang class. Tham số của method trong class vẫn phải tự ghi kiểu.

### Bài 5

```ts
class Transaction {
  readonly id: string;
  readonly amount: number;

  constructor(id: string, amount: number) {
    if (amount <= 0) {
      throw new Error("Số tiền phải lớn hơn 0");
    }
    this.id = id;
    this.amount = amount;
  }

  fee(): number {
    return 0;
  }

  total(): number {
    return this.amount + this.fee();
  }

  describe(): string {
    return `${this.id}: ${this.amount}đ`;
  }
}

class TopUp extends Transaction {
  readonly source: string;

  constructor(id: string, amount: number, source: string) {
    super(id, amount);
    this.source = source;
  }

  describe(): string {
    return `${this.id}: nạp ${this.amount}đ từ ${this.source}`;
  }
}

class Transfer extends Transaction {
  readonly toWalletId: string;

  constructor(id: string, amount: number, toWalletId: string) {
    super(id, amount);
    this.toWalletId = toWalletId;
  }

  fee(): number {
    const raw = Math.round(this.amount * 0.005);
    return Math.min(Math.max(raw, 1000), 10000);
  }

  describe(): string {
    return `${this.id}: chuyển ${this.amount}đ tới ${this.toWalletId}, phí ${this.fee()}đ`;
  }
}

class Withdrawal extends Transaction {
  fee(): number {
    return 3300;
  }

  describe(): string {
    return `${super.describe()} (rút về ngân hàng, phí ${this.fee()}đ)`;
  }
}

function totalFees(transactions: Transaction[]): number {
  let sum = 0;
  for (const transaction of transactions) {
    sum += transaction.fee();
  }
  return sum;
}
```

Cách các ràng buộc được đáp ứng:

- Quy tắc kiểm tra số tiền chỉ nằm trong constructor của `Transaction`. Các class con gọi `super(id, amount)` nên đều đi qua nó.
- `total()` chỉ có ở class cha. Bên trong, `this.fee()` tự gọi đúng phiên bản `fee` của class con.
- `Withdrawal` không khai báo constructor nên dùng luôn constructor của class cha. `describe` của nó gọi `super.describe()` thay vì chép lại chuỗi.
- `totalFees` chỉ gọi `fee()` và không cần biết loại giao dịch.

Kiểm tra phí: 0,5% của 100000 là 500, nâng lên mức tối thiểu 1000. 0,5% của 800000 là 4000. 0,5% của 5000000 là 25000, hạ xuống mức tối đa 10000. Tổng phí: 0 + 1000 + 4000 + 10000 + 3300 = 18300.

Câu hỏi:

1. `list` có kiểu `Transaction[]`, nên mỗi phần tử chỉ được biết là một `Transaction`. TypeScript kiểm tra theo kiểu đã khai báo chứ không theo giá trị thật lúc chạy, và `Transaction` không có `toWalletId`.
2. Dòng `first` biên dịch được, dòng `second` thì không. `Transfer` thêm thuộc tính bắt buộc `toWalletId` mà `Transaction` không có. `Withdrawal` thì không thêm thành viên nào mới, chỉ ghi đè method có sẵn với cùng kiểu; về cấu trúc nó giống hệt `Transaction`, nên một `Transaction` gán được vào biến kiểu `Withdrawal`. Rủi ro: biến `first` mang tên kiểu `Withdrawal` nhưng `first.fee()` trả về 0 chứ không phải 3300. Kiểu đúng mà hành vi sai, và trình biên dịch không giúp được gì ở đây.

### Bài 6

Năm chỗ sai:

| Chỗ sai | Trình biên dịch nói gì |
| --- | --- |
| `CappedVoucher`: dùng `this` trước khi gọi `super` | `super` phải được gọi trước khi truy cập `this` |
| `CappedVoucher.apply` trả về `string` | Không gán được vào `apply` của class cha, vốn trả về `number` |
| `ExpiringVoucher`: constructor không gọi `super` | Thiếu lời gọi `super`, kèm thêm một lỗi dùng `this` trước `super` |
| `ExpiringVoucher.isValid` đòi tham số `now` | Không gán được vào `isValid` của class cha, vốn không nhận tham số |
| `FreeShipVoucher.percent` là `string` | Không gán được vào `percent` của class cha, vốn là `number` |

Hậu quả nếu không bị chặn, nhìn từ hàm `checkout`:

- `apply` trả về chuỗi: `checkout` hứa trả về `number` nhưng lại trả về `"450000đ"`. Nơi gọi đem kết quả đi cộng trừ sẽ ra chuỗi nối hoặc `NaN`.
- `isValid` đòi tham số: `checkout` gọi `voucher.isValid()` không có đối số, nên `now` là `undefined`. Phép so sánh `undefined < this.expiresAt` luôn là `false`, tức mọi voucher có hạn đều bị coi là hết hạn.
- `percent` là chuỗi: `apply` của class cha tính `"100%" / 100`, ra `NaN`, và tổng tiền thành `NaN`.

Cả ba đều cùng một nguyên tắc: class con phải dùng được ở mọi nơi đang dùng class cha.

```ts
class CappedVoucher extends Voucher {
  maxDiscount: number;

  constructor(code: string, percent: number, maxDiscount: number) {
    super(code, percent);
    this.maxDiscount = maxDiscount;
  }

  apply(amount: number): number {
    const discount = Math.min((amount * this.percent) / 100, this.maxDiscount);
    return amount - discount;
  }
}

class ExpiringVoucher extends Voucher {
  expiresAt: Date;

  constructor(code: string, percent: number, expiresAt: Date) {
    super(code, percent);
    this.expiresAt = expiresAt;
  }

  isValid(now = new Date()): boolean {
    return now < this.expiresAt;
  }
}

class FreeShipVoucher extends Voucher {
  constructor(code: string) {
    super(code, 100);
  }
}
```

Ghi chú về `isValid`: tham số có giá trị mặc định là tham số tuỳ chọn với người gọi, nên method vẫn gọi được không đối số như class cha yêu cầu, đồng thời vẫn cho phép truyền một thời điểm cụ thể khi viết test.

### Bài 7

```ts
abstract class Notifier {
  private sent = 0;

  protected abstract maxLength(): number;
  protected abstract deliver(to: string, text: string): void;

  send(to: string, message: string): boolean {
    const text = message.trim();
    if (text === "") {
      return false;
    }
    const limit = this.maxLength();
    const finalText = text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
    this.deliver(to, finalText);
    this.sent += 1;
    return true;
  }

  getSentCount(): number {
    return this.sent;
  }
}

class SmsNotifier extends Notifier {
  protected maxLength(): number {
    return 160;
  }

  protected deliver(to: string, text: string): void {
    console.log(`[SMS → ${to}] ${text}`);
  }
}

class PushNotifier extends Notifier {
  protected maxLength(): number {
    return 40;
  }

  protected deliver(to: string, text: string): void {
    console.log(`[Push → ${to}] ${text}`);
  }
}

class EmailNotifier extends Notifier {
  private readonly from: string;

  constructor(from: string) {
    super();
    this.from = from;
  }

  protected maxLength(): number {
    return 10000;
  }

  protected deliver(to: string, text: string): void {
    console.log(`[Email ${this.from} → ${to}] ${text}`);
  }
}

function notifyAll(channels: Notifier[], to: string, message: string): number {
  let delivered = 0;
  for (const channel of channels) {
    if (channel.send(to, message)) {
      delivered += 1;
    }
  }
  return delivered;
}
```

Mỗi ràng buộc ứng với một lựa chọn:

| Ràng buộc | Lựa chọn |
| --- | --- |
| Quy trình viết một lần | `send` nằm ở class cha |
| Không quên được giới hạn hay bước gửi | Hai method `abstract`; class con thiếu một trong hai thì không biên dịch được |
| Không tạo được kênh chung chung | Class `abstract` không tạo instance được |
| Bộ đếm không ai sửa được, kể cả kênh cụ thể | `private`, chứ không phải `protected` |
| Bên ngoài không gọi thẳng được bước gửi | `deliver` là `protected`: class con cài đặt được, bên ngoài không gọi được |

Điểm dễ nhầm nhất là chọn giữa `private` và `protected`. Bộ đếm chỉ class cha cần chạm vào nên là `private`. Bước gửi thật thì class con phải viết ra nên không thể `private`, nhưng bên ngoài không được gọi nên cũng không thể để công khai.

### Bài 8

```ts
class TxId {
  private static counter = 0;
  static readonly PREFIX = "TX";

  static next(): string {
    TxId.counter += 1;
    return `${TxId.PREFIX}-${String(TxId.counter).padStart(6, "0")}`;
  }

  static issued(): number {
    return TxId.counter;
  }
}
```

Lý do từng dòng bị chặn: bộ đếm là `private`; `PREFIX` là `readonly`; `next` là thành viên của chính class chứ không phải của instance, nên `new TxId().next()` không tồn tại.

Câu hỏi: từ khoá phạm vi truy cập đứng trước, rồi tới `static`, rồi tới `readonly`. Ví dụ: `private static readonly`.

### Bài 9

1. `private` chỉ tồn tại trong hệ thống kiểu của TypeScript. Khi biên dịch sang JavaScript, từ khoá này bị xoá, và `balance` trở thành một thuộc tính bình thường mà ai cũng đọc ghi được. Trình duyệt chạy JavaScript, không chạy TypeScript.
2. Dùng trường riêng tư của chính JavaScript, viết với dấu `#`:

```ts
class HardWallet {
  #balance = 0;

  getBalance(): number {
    return this.#balance;
  }
}
```

Dòng `wallet.balance = 1000000000` trong console lúc này chỉ tạo ra một thuộc tính mới tên `balance`, không liên quan gì tới `#balance`. `getBalance()` vẫn trả về `0`.

3. Không. `private #balance` là lỗi biên dịch: không được dùng từ khoá phạm vi truy cập cùng với tên riêng tư. Trường `#` vốn đã luôn riêng tư.
4. `readonly`. Nó cũng chỉ tồn tại trong hệ thống kiểu, nên trong console `wallet.id = "W-2"` vẫn chạy được.
5. An toàn theo nghĩa: code JavaScript khác trên trang, kể cả thư viện bên thứ ba, không sửa được giá trị bên trong object. Chưa an toàn theo nghĩa: đây vẫn là dữ liệu nằm trên máy người dùng. Số dư thật phải do server quản lý và kiểm tra ở mỗi giao dịch; không cơ chế nào ở phía trình duyệt thay được điều đó.

### Bài 10

```ts
interface CsvExportable {
  toCsvRow(): string;
}

abstract class Entry implements CsvExportable {
  private static nextNumber = 1;

  readonly id: string;
  readonly amount: number;
  note?: string;

  constructor(amount: number) {
    if (amount <= 0) {
      throw new Error("Số tiền phải lớn hơn 0");
    }
    this.id = `E-${Entry.nextNumber}`;
    Entry.nextNumber += 1;
    this.amount = amount;
  }

  abstract signedAmount(): number;
  abstract label(): string;

  toCsvRow(): string {
    const note = this.note === undefined ? "" : this.note;
    return `${this.id},${this.label()},${this.signedAmount()},${note}`;
  }
}

class Income extends Entry {
  signedAmount(): number {
    return this.amount;
  }

  label(): string {
    return "thu";
  }
}

class Expense extends Entry {
  readonly category: string;

  constructor(amount: number, category: string) {
    super(amount);
    this.category = category;
  }

  signedAmount(): number {
    return -this.amount;
  }

  label(): string {
    return `chi:${this.category}`;
  }
}

class Ledger implements CsvExportable {
  readonly owner: string;
  private entries: Entry[] = [];

  constructor(owner: string) {
    this.owner = owner;
  }

  balance(): number {
    let sum = 0;
    for (const entry of this.entries) {
      sum += entry.signedAmount();
    }
    return sum;
  }

  count(): number {
    return this.entries.length;
  }

  add(entry: Entry): void {
    if (this.balance() + entry.signedAmount() < 0) {
      throw new Error("Không đủ số dư");
    }
    this.entries.push(entry);
  }

  toCsvRow(): string {
    return `${this.owner},${this.count()},${this.balance()}`;
  }

  exportCsv(): string[] {
    const rows = ["id,loại,số tiền,ghi chú"];
    for (const entry of this.entries) {
      rows.push(entry.toCsvRow());
    }
    return rows;
  }
}

function toCsv(items: CsvExportable[]): string[] {
  const rows: string[] = [];
  for (const item of items) {
    rows.push(item.toCsvRow());
  }
  return rows;
}
```

Kiểm tra số liệu: 15000000 − 4500000 − 45000 = 10455000.

Câu hỏi:

1. Mã `E-4` đã được cấp cho khoản chi 20000000 mua xe. Khoản đó được tạo ra thành công, và mã được cấp ngay trong constructor; chỉ tới bước `ledger.add` nó mới bị từ chối. Đây không phải lỗi của ngôn ngữ mà là hệ quả của thiết kế "cấp mã lúc tạo": dãy mã sẽ có khoảng trống. Nếu nghiệp vụ đòi mã liên tục thì phải cấp mã ở thời điểm ghi sổ, tức trong `add`.
2. Cả hai class đều khai báo `implements CsvExportable`, và `toCsv` chỉ đòi hỏi interface đó. Một class chỉ kế thừa được từ một class cha, nhưng tuân theo được nhiều interface, nên interface là cách để những class không liên quan dùng chung một hàm.
3. Bên ngoài còn sửa được `salary.note`, vì ghi chú không phải `readonly`. Việc đó không ảnh hưởng số dư. `amount` là `readonly` nên không sửa được, và số dư được tính lại từ các khoản mỗi lần gọi `balance()`. Việc che danh sách chỉ bảo vệ được sổ khi chính các khoản trong sổ cũng không cho sửa những gì ảnh hưởng tới số dư; hai lớp bảo vệ này phải đi cùng nhau.

### Tự đánh giá

| Số bài đạt | Gợi ý |
| --- | --- |
| 9–10 | Nắm chắc chương, có thể sang Chương 9 |
| 6–8 | Làm lại các bài chưa đạt sau một ngày, không xem đáp án |
| Dưới 6 | Đọc lại chương theo bảng ở mục Gợi ý rồi làm lại từ Bài 1 |

Một bài được tính là đạt khi phần Nghiệm thu in ra đúng, mọi dòng trong "Phải bị chặn" đều bị trình biên dịch báo lỗi, và các ràng buộc thiết kế được đáp ứng mà không cần xem đáp án.