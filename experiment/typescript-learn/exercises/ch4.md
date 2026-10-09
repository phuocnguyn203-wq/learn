# Bài tập TypeScript — Chương 4: Objects (Intermediate)

Bộ bài tập bám sát Chương 4 "Objects" của sách *Learning TypeScript* (Josh Goldberg).

## Mục lục

- [Cách làm bài](#cách-làm-bài)
- [Phần 1 — Object types, structural typing, excess property checks](#phần-1--object-types-structural-typing-excess-property-checks)
- [Phần 2 — Nested object types và optional properties](#phần-2--nested-object-types-và-optional-properties)
- [Phần 3 — Union của object types và narrowing bằng `in`](#phần-3--union-của-object-types-và-narrowing-bằng-in)
- [Phần 4 — Discriminated unions](#phần-4--discriminated-unions)
- [Phần 5 — Intersection types và `never`](#phần-5--intersection-types-và-never)
- [Phần 6 — Bài tổng hợp: thư viện thơ](#phần-6--bài-tổng-hợp-thư-viện-thơ)
- [Đáp án và giải thích](#đáp-án-và-giải-thích)

## Cách làm bài

Bộ bài gồm 16 bài, làm trong khoảng 110 phút. Mọi đoạn code giả định bật `strict` trong `tsconfig.json`.

- **Dự đoán trước, chạy sau.** Với các bài "dự đoán", hãy ghi câu trả lời ra giấy rồi mới dán code vào TypeScript Playground để kiểm tra.
- **Giải thích bằng lời.** Mỗi câu trả lời "có lỗi" cần nêu được TypeScript phàn nàn về điều gì, không chỉ nêu dòng nào.
- **Không dùng `any`, `as` hay `// @ts-ignore`** để làm lỗi biến mất.
- Đáp án và giải thích nằm ở cuối tài liệu. Làm xong cả phần rồi mới đối chiếu.

| Phần | Chủ đề | Số bài | Thời gian gợi ý |
| --- | --- | --- | --- |
| 1 | Object types, structural typing, excess property checks | 3 | 15 phút |
| 2 | Nested object types, optional properties | 3 | 15 phút |
| 3 | Union của object types, narrowing bằng `in` | 3 | 15 phút |
| 4 | Discriminated unions | 3 | 20 phút |
| 5 | Intersection types và `never` | 3 | 15 phút |
| 6 | Bài tổng hợp | 1 | 30 phút |

## Phần 1 — Object types, structural typing, excess property checks

Ba bài này kiểm tra việc bạn phân biệt được ba loại lỗi gán: thiếu thuộc tính, sai kiểu thuộc tính, và thừa thuộc tính.

### Bài 1.1 — Dự đoán lỗi

Trong các dòng A–G, dòng nào bị TypeScript báo lỗi? Với mỗi dòng lỗi, nêu nội dung lỗi bằng lời của bạn.

```ts
type Poet = { born: number; name: string };

const a: Poet = { born: 1935, name: "Mary Oliver" };                        // A
const b: Poet = { born: "1935", name: "Mary Oliver" };                      // B
const c: Poet = { name: "Sappho" };                                         // C
const d: Poet = { born: 1928, name: "Maya Angelou", activity: "writing" };  // D

const raw = { born: 1928, name: "Maya Angelou", activity: "writing" };
const e: Poet = raw;                                                        // E
e.activity;                                                                 // F
raw.activity;                                                               // G
```

Câu hỏi thêm: D và E đưa vào cùng một nội dung object. Vì sao kết quả kiểm tra lại khác nhau?

### Bài 1.2 — Structural typing

Dự đoán dòng nào lỗi trong A–D, rồi trả lời hai câu hỏi bên dưới.

```ts
type WithTitle = { title: string };
type WithYear = { year: number };

const book = { title: "Ariel", year: 1965, pages: 96 };

let byTitle: WithTitle = book;        // A
let byYear: WithYear = book;          // B
byTitle = byYear;                     // C
byYear = { year: 1965, pages: 96 };   // D
```

1. `book` không hề được khai báo là `WithTitle` hay `WithYear`. Vì sao A và B vẫn hợp lệ?
2. Lúc chạy, `byYear` trỏ tới chính object `book`, vốn có `title`. Vì sao dòng C vẫn bị từ chối?

### Bài 1.3 — Lỗi gõ nhầm tên thuộc tính

Đoạn code sau có một lỗi gõ nhầm.

```ts
type Collection = { name: string; publishedYear: number };

const dreamWork: Collection = {
  name: "Dream Work",
  publishYear: 1986,
};
```

1. TypeScript báo lỗi gì ở đây? Lỗi đó thuộc loại nào trong ba loại ở đầu phần?
2. Một đồng nghiệp "sửa" bằng cách tách object ra biến riêng như bên dưới. Lỗi cũ có biến mất không? Có lỗi mới nào xuất hiện không?
3. Viết lại cho đúng.

```ts
const draft = { name: "Dream Work", publishYear: 1986 };
const dreamWork: Collection = draft;
```

## Phần 2 — Nested object types và optional properties

Trọng tâm của phần này là khác biệt giữa thuộc tính tuỳ chọn (`?`) và thuộc tính bắt buộc có kiểu `| undefined`.

### Bài 2.1 — Tách kiểu lồng nhau

Kiểu `Poem` dưới đây viết mọi thứ lồng vào nhau.

```ts
type Poem = {
  author: { firstName: string; lastName: string };
  publisher: { name: string; city: string };
  name: string;
};
```

1. Viết lại bằng cách tách `Author` và `Publisher` thành type alias riêng. `Poem` phải mô tả đúng cùng một shape.
2. Với kiểu mới, dự đoán lỗi ở ba chỗ đánh dấu A, B, C. Thông báo lỗi sẽ nhắc tới tên kiểu nào?
3. Việc tách alias mang lại lợi ích gì cho thông báo lỗi?

```ts
const tulips: Poem = {
  author: { name: "Sylvia Plath" },                     // A
  publisher: { name: "Faber", city: "London" },
  name: "Tulips",
};

const daddy: Poem = {
  author: { firstName: "Sylvia", lastName: "Plath" },
  publisher: { name: "Faber" },                         // B
  name: "Daddy",
};

daddy.publisher.country;                                // C
```

### Bài 2.2 — `?` so với `| undefined`

Dự đoán dòng nào lỗi trong A–F và giải thích từng dòng.

```ts
type Reading = {
  venue: string;
  host: string | undefined;
  guest?: string;
};

const r1: Reading = { venue: "Hà Nội", host: undefined };                 // A
const r2: Reading = { venue: "Huế" };                                     // B
const r3: Reading = { venue: "Đà Nẵng", host: "Lan", guest: undefined };  // C
const r4: Reading = { venue: "Sài Gòn", host: "Lan", guest: null };       // D

r1.guest.toUpperCase();                                                   // E
r1.host.toUpperCase();                                                    // F
```

### Bài 2.3 — Từ yêu cầu sang kiểu

Viết kiểu `Book` (kèm alias `Publisher`) thoả đúng các yêu cầu sau:

- `title` là chuỗi, bắt buộc.
- `subtitle` là chuỗi, có thể không xuất hiện.
- `translator` luôn phải xuất hiện trong object, nhưng giá trị có thể là `undefined` khi sách không có dịch giả.
- `publisher` là object lồng, có `name` bắt buộc và `city` tuỳ chọn.

Sau đó cho biết object nào trong bốn object sau gán được vào `Book`, object nào không và vì sao.

```ts
const b1 = { title: "Ariel", translator: undefined, publisher: { name: "Faber" } };
const b2 = { title: "Ariel", publisher: { name: "Faber", city: "London" } };
const b3 = { title: "Ariel", subtitle: "Poems", translator: "Hoàng Hưng", publisher: { city: "London" } };
const b4 = { title: "Ariel", translator: "Hoàng Hưng", publisher: { name: "Faber" }, pages: 96 };
```

Lưu ý với `b4`: kết quả có khác nhau không giữa hai cách viết `const x: Book = b4;` và `const x: Book = { ...viết thẳng nội dung của b4... };`?

## Phần 3 — Union của object types và narrowing bằng `in`

Phần này so sánh union do TypeScript tự suy luận với union bạn khai báo tường minh, rồi luyện thu hẹp kiểu bằng toán tử `in`.

### Bài 3.1 — Union được suy luận

```ts
const entry = Math.random() > 0.5
  ? { title: "Ariel", pages: 96 }
  : { title: "Daddy", stanzas: 16, rhymes: true };
```

1. Viết ra kiểu đầy đủ mà TypeScript suy luận cho `entry` (gồm hai thành phần của union).
2. Cho biết kiểu của `entry.title`, `entry.pages`, `entry.stanzas` và `entry.rhymes`.
3. `entry.author` có hợp lệ không? Vì sao nó khác với `entry.pages`?

### Bài 3.2 — Union tường minh

```ts
type Printed = { title: string; pages: number };
type Recorded = { title: string; minutes: number };
type Work = Printed | Recorded;

const work: Work = Math.random() > 0.5
  ? { title: "Ariel", pages: 96 }
  : { title: "Ariel (audio)", minutes: 74 };

work.title;                 // A
work.pages;                 // B
if (work.minutes) {         // C
  console.log(work.minutes);
}
```

1. Dòng nào lỗi trong A, B, C? So với Bài 3.1, vì sao `work.pages` ở đây không còn là `number | undefined`?
2. Vì sao cách kiểm tra truthiness ở dòng C không được chấp nhận?
3. Viết đoạn `if / else` in ra `"Ariel: 96 trang"` hoặc `"Ariel (audio): 74 phút"` tuỳ theo shape của `work`.

### Bài 3.3 — Narrowing với ba thành phần

Union giờ có thêm `Performed`. Giả sử `work` có kiểu `Work`.

```ts
type Printed = { title: string; pages: number };
type Recorded = { title: string; minutes: number };
type Performed = { title: string; minutes: number; venue: string };
type Work = Printed | Recorded | Performed;

if ("minutes" in work) {
  // (1) kiểu của work ở đây?
  work.venue;                    // A — hợp lệ không?
  if ("venue" in work) {
    // (2) kiểu của work ở đây?
  } else {
    // (3) kiểu của work ở đây?
  }
} else {
  // (4) kiểu của work ở đây?
}
```

1. Điền kiểu của `work` tại bốn vị trí (1)–(4).
2. Dòng A có lỗi không? Giải thích dựa trên kiểu ở vị trí (1).
3. Cách thu hẹp này phụ thuộc vào việc mỗi shape có tập thuộc tính riêng. Nêu một rủi ro khi union lớn dần theo thời gian (gợi ý cho Phần 4).

## Phần 4 — Discriminated unions

Ba bài này luyện thiết kế discriminant (thuộc tính phân biệt) và nhận ra khi nào nó không hoạt động.

### Bài 4.1 — Chuyển sang discriminated union

Lấy ba kiểu `Printed`, `Recorded`, `Performed` của Bài 3.3.

1. Thêm thuộc tính `kind` vào mỗi kiểu với giá trị lần lượt là `"printed"`, `"recorded"`, `"performed"`.
2. Khai báo một biến `work: Work` cho mỗi loại (ba biến).
3. Viết chuỗi `if / else if / else` kiểm tra `work.kind` và in ra:
   - `"<title>: <pages> trang"` cho bản in,
   - `"<title>: <minutes> phút"` cho bản thu,
   - `"<title>: <minutes> phút tại <venue>"` cho buổi diễn.
4. Trong nhánh `else` cuối cùng, bạn không kiểm tra gì mà vẫn truy cập được `work.venue`. Vì sao?

### Bài 4.2 — Discriminant không hoạt động

Đoạn code sau trông giống một discriminated union nhưng TypeScript báo lỗi ở cả hai nhánh.

```ts
type Haiku = { type: string; kigo: string };
type Sonnet = { type: string; lines: number };
type Poem = Haiku | Sonnet;

const poem: Poem = Math.random() > 0.5
  ? { type: "haiku", kigo: "Morning Glory" }
  : { type: "sonnet", lines: 14 };

if (poem.type === "haiku") {
  console.log(poem.kigo);    // lỗi
} else {
  console.log(poem.lines);   // lỗi
}
```

1. Vì sao phép so sánh `poem.type === "haiku"` không thu hẹp được kiểu của `poem`?
2. Sửa hai khai báo kiểu để code chạy đúng. Không được sửa phần `if / else`.
3. Sau khi sửa, `{ type: "limerick", lines: 5 }` có còn gán được vào `Poem` không? Điều đó tốt hay xấu?

### Bài 4.3 — Trạng thái của một request

Giả sử `state` có kiểu `RequestState`. Dự đoán dòng nào lỗi trong A–H.

```ts
type Loading = { status: "loading" };
type Success = { status: "success"; data: string };
type Failure = { status: "error"; message: string };
type RequestState = Loading | Success | Failure;

const s1: RequestState = { status: "success" };                 // A
const s2: RequestState = { status: "done", data: "ok" };        // B
const s3: RequestState = { status: "loading", data: "ok" };     // C
const s4: RequestState = { status: "error", message: "404" };   // D

state.status;                                                   // E
if (state.status !== "loading") {
  state.data;                                                   // F
  if (state.status === "success") {
    state.data.length;                                          // G
  } else {
    state.message;                                              // H
  }
}
```

Câu hỏi thêm: kiểu của `state.status` tại dòng E là gì? Kiểu của `state` ngay trước dòng F là gì?

## Phần 5 — Intersection types và `never`

Phần này luyện ghép kiểu bằng `&` và nhận ra khi phép ghép tạo ra một kiểu không thể có giá trị.

### Bài 5.1 — Intersection cơ bản

```ts
type Artwork = { genre: string; name: string };
type Writing = { pages: number; name: string };
type WrittenArt = Artwork & Writing;

const w1: WrittenArt = { genre: "thơ", name: "Ariel", pages: 96 };              // A
const w2: WrittenArt = { genre: "thơ", name: "Ariel" };                         // B
const w3: Artwork = w1;                                                         // C
const w4: WrittenArt = { genre: "thơ", name: "Ariel", pages: 96, year: 1965 };  // D

const art: Artwork = { genre: "thơ", name: "Ariel" };
const w5: WrittenArt = art;                                                     // E
```

1. Viết kiểu object "phẳng" tương đương với `WrittenArt`, không dùng `&`.
2. Dòng nào lỗi trong A–E? Giải thích.
3. C và E là hai chiều gán ngược nhau. Chiều nào hợp lệ và vì sao?

### Bài 5.2 — Làm thông báo lỗi dễ đọc hơn

Kiểu sau kết hợp intersection với union trong một khai báo duy nhất.

```ts
type ShortPoem = { author: string } & (
  | { kigo: string; type: "haiku" }
  | { meter: number; type: "villanelle" }
);
```

1. Tách thành các alias có tên: `ShortPoemBase`, `Haiku`, `Villanelle`, rồi `ShortPoem`.
2. Thêm loại thứ ba `Limerick` có `funny: boolean` và `type: "limerick"`, rồi khai báo một biến hợp lệ thuộc loại này.
3. Với kiểu đã tách, object dưới đây lỗi ở đâu? Thông báo lỗi nhắc tới tên kiểu nào mà bản gốc không nhắc được?

```ts
const oneArt: ShortPoem = {
  author: "Elizabeth Bishop",
  type: "villanelle",
};
```

### Bài 5.3 — `never`

Cho biết kiểu kết quả ở mỗi mục và giá trị nào (nếu có) gán được vào đó.

```ts
type A = number & string;                                 // (1)

type WithNumId = { id: number };
type WithStrId = { id: string };
type Both = WithNumId & WithStrId;                        // (2) kiểu của thuộc tính id?

type H = { type: "haiku"; kigo: string }
       & { type: "sonnet"; lines: number };               // (3)
```

1. (1) là kiểu gì? Vì sao không giá trị nào thoả được?
2. Ở (2), kiểu của `id` trong `Both` là gì? `{ id: 1 }` và `{ id: "1" }` có gán được vào `Both` không?
3. Ở (3), hai kiểu có discriminant `type` khác nhau. `H` là kiểu gì?
4. Nếu bạn thấy `never` xuất hiện trong một thông báo lỗi ở dự án thật, nguyên nhân thường gặp nhất là gì?

## Phần 6 — Bài tổng hợp: thư viện thơ

Bài này yêu cầu bạn tự thiết kế kiểu từ mô tả nghiệp vụ, dùng gần hết kiến thức của chương.

### Bài 6 — Mô hình hoá `LibraryItem`

Một thư viện lưu ba loại ấn phẩm. Mọi ấn phẩm đều có:

- `id` là số và `title` là chuỗi.
- `author` là object lồng có `firstName` bắt buộc và `lastName` tuỳ chọn (một số tác giả cổ chỉ có một tên).
- `kind` cho biết loại ấn phẩm.

Phần riêng của từng loại:

| `kind` | Thuộc tính riêng |
| --- | --- |
| `"book"` | `pages` là số; `isbn` là chuỗi, có thể không xuất hiện |
| `"audio"` | `minutes` là số; `narrator` luôn phải xuất hiện, giá trị là chuỗi hoặc `undefined` |
| `"ebook"` | `pages` là số; `fileSizeMb` là số |

**Yêu cầu**

1. Khai báo các kiểu `Author`, `ItemBase`, `PrintedBook`, `AudioBook`, `EBook` và `LibraryItem`. Dùng intersection để không lặp lại phần chung, và đặt tên alias cho từng phần.
2. Khai báo ba biến kiểu `LibraryItem`, mỗi loại một biến. Ít nhất một tác giả không có `lastName` và bản audio có `narrator: undefined`.
3. Viết hàm `describe(item: LibraryItem): string` trả về chuỗi theo mẫu dưới đây. Tham số có chú thích kiểu viết giống hệt chú thích kiểu của biến.
4. Trả lời phần câu hỏi kiểm tra ở cuối bài.

**Mẫu kết quả của `describe`**

```text
#1 Ariel — Sylvia Plath: 96 trang
#1 Ariel — Sylvia Plath: 96 trang, ISBN 978-0571086269      (khi có isbn)
#2 Fragments — Sappho: 45 phút, chưa rõ người đọc          (narrator là undefined)
#2 Fragments — Sappho: 45 phút, đọc bởi Anne Carson       (có narrator)
#3 Dream Work — Mary Oliver: 90 trang, 1.2 MB
```

Ràng buộc: không dùng `any`, `as`, hay toán tử `!`. Tên tác giả không được in ra chữ `undefined` khi thiếu `lastName`.

**Câu hỏi kiểm tra**

Với kiểu bạn vừa viết, dòng nào trong A–D bị lỗi và vì sao?

```ts
const x1: LibraryItem = { id: 4, title: "Odes", author: { firstName: "Sappho" }, kind: "audio", minutes: 30 };                  // A
const x2: LibraryItem = { id: 5, title: "Odes", author: { firstName: "Sappho" }, kind: "book", pages: 80, fileSizeMb: 2 };     // B
const x3: LibraryItem = { id: 6, title: "Odes", author: { lastName: "Sappho" }, kind: "ebook", pages: 80, fileSizeMb: 2 };     // C
const x4: LibraryItem = { id: 7, title: "Odes", author: { firstName: "Sappho" }, kind: "book", pages: 80, isbn: undefined };   // D
```

Câu hỏi mở rộng: bên trong `describe`, trước khi kiểm tra `kind`, `item.pages` có truy cập được không dù hai trong ba loại đều có `pages`? Sau `if ("pages" in item)`, kiểu của `item` là gì?

## Đáp án và giải thích

Mọi đáp án dưới đây đã được kiểm bằng trình biên dịch TypeScript với `strict` bật. Chỉ đọc sau khi đã tự làm.

### Phần 1

**Bài 1.1.** Lỗi ở B, C, D, F. Các dòng A, E, G hợp lệ.

| Dòng | Kết quả | Lý do |
| --- | --- | --- |
| A | Hợp lệ | Đủ thuộc tính, đúng kiểu |
| B | Lỗi | `born` là `string`, không gán được cho `number` |
| C | Lỗi | Thiếu thuộc tính bắt buộc `born` |
| D | Lỗi | Object literal có thuộc tính thừa `activity` |
| E | Hợp lệ | `raw` là biến có sẵn, chỉ cần khớp cấu trúc với `Poet` |
| F | Lỗi | `e` có kiểu `Poet`, mà `Poet` không có `activity` |
| G | Hợp lệ | Kiểu suy luận của `raw` có `activity` |

D và E khác nhau vì excess property check chỉ chạy khi một object literal được tạo ngay tại vị trí đã khai báo kiểu. Ở E, giá trị là một biến có sẵn nên TypeScript chỉ kiểm tra structural typing.

**Bài 1.2.** Lỗi ở C và D.

1. A và B hợp lệ vì TypeScript là structurally typed: `book` có `title: string` và `year: number` nên thoả cả hai kiểu, dù không được khai báo như vậy.
2. Ở C, TypeScript chỉ biết `byYear` có kiểu `WithYear`, và kiểu đó không có `title`. Việc kiểm tra diễn ra tĩnh trên kiểu, không dựa vào giá trị lúc chạy.
3. D lỗi vì đây là object literal gán thẳng vào biến kiểu `WithYear`, nên `pages` bị coi là thuộc tính thừa. So với dòng B: cùng thừa `pages` nhưng B dùng biến có sẵn.

**Bài 1.3.**

1. Lỗi thuộc tính thừa: `publishYear` không tồn tại trong `Collection`. TypeScript còn gợi ý "Did you mean to write 'publishedYear'?".
2. Lỗi thừa biến mất vì `draft` là biến có sẵn. Nhưng xuất hiện lỗi thiếu thuộc tính: `publishedYear` bắt buộc mà `draft` không có. Tách biến không che được lỗi gõ nhầm với thuộc tính bắt buộc.
3. Sửa tên thuộc tính:

```ts
const dreamWork: Collection = {
  name: "Dream Work",
  publishedYear: 1986,
};
```

### Phần 2

**Bài 2.1.**

```ts
type Author = { firstName: string; lastName: string };
type Publisher = { name: string; city: string };
type Poem = { author: Author; publisher: Publisher; name: string };
```

- A: lỗi thuộc tính thừa, `name` không tồn tại trong kiểu `Author`. TypeScript dừng ở lỗi này và chưa nhắc tới việc thiếu `firstName`, `lastName`.
- B: thiếu `city`, bắt buộc trong kiểu `Publisher`.
- C: `country` không tồn tại trên kiểu `Publisher`.
- Lợi ích: thông báo lỗi in tên ngắn `Author`, `Publisher` thay vì cả shape `{ firstName: string; lastName: string; }`.

**Bài 2.2.** Lỗi ở B, D, E, F. Các dòng A, C hợp lệ.

| Dòng | Kết quả | Lý do |
| --- | --- | --- |
| A | Hợp lệ | `host` có mặt (giá trị `undefined`), `guest` được phép vắng |
| B | Lỗi | `host` bắt buộc phải có mặt, dù kiểu của nó chứa `undefined` |
| C | Hợp lệ | Thuộc tính tuỳ chọn nhận được `undefined` ở cấu hình `strict` mặc định |
| D | Lỗi | `null` không gán được cho `string \| undefined` |
| E | Lỗi | `r1.guest` có thể là `undefined` |
| F | Lỗi | `r1.host` có thể là `undefined` |

Ghi chú cho C: nếu bật thêm tuỳ chọn `exactOptionalPropertyTypes` thì dòng này sẽ thành lỗi. Sách nhắc tới các thiết lập này ở Chương 13.

**Bài 2.3.**

```ts
type Publisher = { name: string; city?: string };

type Book = {
  title: string;
  subtitle?: string;
  translator: string | undefined;
  publisher: Publisher;
};
```

- `b1`: gán được.
- `b2`: không, thiếu `translator`. Thuộc tính này bắt buộc có mặt.
- `b3`: không, `publisher` thiếu `name`.
- `b4`: tuỳ cách viết. `const x: Book = b4;` hợp lệ vì `b4` là biến có sẵn. Viết thẳng object literal thì lỗi thuộc tính thừa `pages`.

### Phần 3

**Bài 3.1.**

```ts
// Kiểu của entry:
// { title: string; pages: number; stanzas?: undefined; rhymes?: undefined }
// |
// { title: string; pages?: undefined; stanzas: number; rhymes: boolean }
```

- `entry.title` là `string`; `entry.pages` là `number | undefined`; `entry.stanzas` là `number | undefined`; `entry.rhymes` là `boolean | undefined`.
- `entry.author` lỗi vì không thành phần nào của union có `author`. `entry.pages` thì được vì khi suy luận, TypeScript thêm `pages?: undefined` vào thành phần còn lại.

**Bài 3.2.**

1. B và C lỗi, A hợp lệ. Với union tường minh, TypeScript chỉ cho truy cập thuộc tính có trên mọi thành phần. `Recorded` không khai báo `pages` nên không có `pages?: undefined` nào được thêm vào.
2. `if (work.minutes)` vẫn là một lần truy cập thuộc tính có thể không tồn tại, nên bị coi là lỗi kiểu ngay cả khi dùng như type guard.
3. Dùng `in`:

```ts
if ("pages" in work) {
  console.log(`${work.title}: ${work.pages} trang`);
} else {
  console.log(`${work.title}: ${work.minutes} phút`);
}
```

**Bài 3.3.**

1. (1) `Recorded | Performed`; (2) `Performed`; (3) `Recorded`; (4) `Printed`.
2. A lỗi: ở vị trí (1) `work` vẫn có thể là `Recorded`, vốn không có `venue`.
3. Rủi ro: khi thêm một shape mới trùng tên thuộc tính với shape cũ, các phép kiểm tra `in` hiện có âm thầm bao luôn shape mới. Một discriminant riêng cho mỗi shape tránh được điều này.

### Phần 4

**Bài 4.1.**

```ts
type Printed = { kind: "printed"; title: string; pages: number };
type Recorded = { kind: "recorded"; title: string; minutes: number };
type Performed = { kind: "performed"; title: string; minutes: number; venue: string };
type Work = Printed | Recorded | Performed;

if (work.kind === "printed") {
  console.log(`${work.title}: ${work.pages} trang`);
} else if (work.kind === "recorded") {
  console.log(`${work.title}: ${work.minutes} phút`);
} else {
  console.log(`${work.title}: ${work.minutes} phút tại ${work.venue}`);
}
```

Trong nhánh `else` cuối, TypeScript đã loại `Printed` và `Recorded`, nên `work` chỉ còn có thể là `Performed`.

**Bài 4.2.**

1. `type` được khai báo là `string` ở cả hai kiểu. Một `Sonnet` vẫn có thể có `type` bằng `"haiku"`, nên phép so sánh không loại được thành phần nào.
2. Dùng kiểu literal cho discriminant:

```ts
type Haiku = { type: "haiku"; kigo: string };
type Sonnet = { type: "sonnet"; lines: number };
```

3. Không còn gán được: `"limerick"` không thuộc `"haiku" | "sonnet"`. Đó là điều tốt, vì giá trị lạ bị chặn ngay lúc biên dịch thay vì rơi nhầm vào nhánh `else`.

**Bài 4.3.** Lỗi ở A, B, C, F. Các dòng D, E, G, H hợp lệ.

| Dòng | Kết quả | Lý do |
| --- | --- | --- |
| A | Lỗi | `status: "success"` chọn `Success`, mà `Success` cần `data` |
| B | Lỗi | `"done"` không thuộc `"loading" \| "success" \| "error"` |
| C | Lỗi | `data` là thuộc tính thừa đối với `Loading` |
| D | Hợp lệ | Khớp `Failure` |
| E | Hợp lệ | `status` có trên mọi thành phần |
| F | Lỗi | `state` là `Success \| Failure`, và `Failure` không có `data` |
| G | Hợp lệ | `state` đã thu hẹp về `Success` |
| H | Hợp lệ | `state` chỉ còn có thể là `Failure` |

Kiểu của `state.status` tại E là `"loading" | "success" | "error"`. Ngay trước F, `state` có kiểu `Success | Failure`.

### Phần 5

**Bài 5.1.**

1. `{ genre: string; name: string; pages: number }`. Thuộc tính `name` xuất hiện ở cả hai phía với cùng kiểu nên chỉ còn một.
2. Lỗi ở B, D, E. B thiếu `pages`. D có thuộc tính thừa `year`. E thiếu `pages` vì `art` có kiểu `Artwork`.
3. C hợp lệ: `WrittenArt` có đủ mọi thuộc tính của `Artwork`. E thì không, vì `Artwork` chưa chắc có `pages`. Kiểu có nhiều thuộc tính hơn gán được vào chỗ cần ít hơn, không có chiều ngược lại.

**Bài 5.2.**

```ts
type ShortPoemBase = { author: string };
type Haiku = ShortPoemBase & { kigo: string; type: "haiku" };
type Villanelle = ShortPoemBase & { meter: number; type: "villanelle" };
type Limerick = ShortPoemBase & { funny: boolean; type: "limerick" };
type ShortPoem = Haiku | Villanelle | Limerick;

const owl: ShortPoem = { author: "Edward Lear", funny: true, type: "limerick" };
```

`oneArt` lỗi vì thiếu `meter`. Với kiểu đã tách, thông báo ghi "is not assignable to type 'Villanelle'". Bản gốc phải in nguyên `{ author: string; } & { meter: number; type: "villanelle"; }`.

**Bài 5.3.**

1. `never`. Không giá trị nào vừa là `number` vừa là `string`.
2. `id` có kiểu `number & string`, tức `never`. Cả `{ id: 1 }` lẫn `{ id: "1" }` đều không gán được, nên thực tế không tạo được giá trị nào cho `Both`.
3. `H` bị rút gọn hẳn thành `never`, vì `type` không thể vừa là `"haiku"` vừa là `"sonnet"`.
4. Thường là do dùng nhầm `&` ở chỗ đáng lẽ là `|`, hoặc ghép hai kiểu có cùng tên thuộc tính nhưng khác kiểu.

### Phần 6

**Bài 6.** Một lời giải mẫu:

```ts
type Author = { firstName: string; lastName?: string };
type ItemBase = { id: number; title: string; author: Author };

type PrintedBook = ItemBase & { kind: "book"; pages: number; isbn?: string };
type AudioBook = ItemBase & { kind: "audio"; minutes: number; narrator: string | undefined };
type EBook = ItemBase & { kind: "ebook"; pages: number; fileSizeMb: number };

type LibraryItem = PrintedBook | AudioBook | EBook;

const ariel: LibraryItem = {
  id: 1, title: "Ariel", author: { firstName: "Sylvia", lastName: "Plath" },
  kind: "book", pages: 96,
};
const fragments: LibraryItem = {
  id: 2, title: "Fragments", author: { firstName: "Sappho" },
  kind: "audio", minutes: 45, narrator: undefined,
};
const dreamWork: LibraryItem = {
  id: 3, title: "Dream Work", author: { firstName: "Mary", lastName: "Oliver" },
  kind: "ebook", pages: 90, fileSizeMb: 1.2,
};

function describe(item: LibraryItem): string {
  let authorName = item.author.firstName;
  if (item.author.lastName !== undefined) {
    authorName = `${authorName} ${item.author.lastName}`;
  }
  const prefix = `#${item.id} ${item.title} — ${authorName}`;

  if (item.kind === "book") {
    if (item.isbn !== undefined) {
      return `${prefix}: ${item.pages} trang, ISBN ${item.isbn}`;
    }
    return `${prefix}: ${item.pages} trang`;
  } else if (item.kind === "audio") {
    if (item.narrator === undefined) {
      return `${prefix}: ${item.minutes} phút, chưa rõ người đọc`;
    }
    return `${prefix}: ${item.minutes} phút, đọc bởi ${item.narrator}`;
  } else {
    return `${prefix}: ${item.pages} trang, ${item.fileSizeMb} MB`;
  }
}
```

Câu hỏi kiểm tra: lỗi ở A, B, C. Dòng D hợp lệ.

- A: thiếu `narrator`. Thuộc tính này bắt buộc có mặt dù được phép là `undefined`.
- B: `kind: "book"` chọn `PrintedBook`, nên `fileSizeMb` là thuộc tính thừa.
- C: `author` thiếu `firstName`.
- D: `isbn` là thuộc tính tuỳ chọn nên nhận được `undefined`.

Câu hỏi mở rộng: `item.pages` không truy cập được trước khi thu hẹp, vì `AudioBook` không có `pages`. Sau `if ("pages" in item)`, `item` có kiểu `PrintedBook | EBook`.

### Tự đánh giá

| Số bài làm đúng | Gợi ý |
| --- | --- |
| 14–16 | Nắm chắc chương, có thể sang Chương 5 |
| 10–13 | Xem lại phần sai nhiều nhất, làm lại sau một ngày |
| Dưới 10 | Đọc lại chương, chú ý mục Excess Property Checking và Narrowing Object Types |
