# Lộ trình Backend Node.js + TypeScript — Bài tập chi tiết

> **Project xuyên suốt:** Task Manager API (User – Project – Task)
> **Cường độ:** 4–6 tiếng/ngày · **Tổng:** ~26 ngày học (~5 tuần)
> **Đã hoàn thành:** Node.js Design Patterns, chương 1–5

## Cách dùng file này

Mỗi bài có 4 phần:

- **Mục tiêu** — bài này luyện kỹ năng gì
- **Cần làm** — yêu cầu cụ thể
- **Kết quả mong muốn** — chạy ra phải trông như thế nào
- **Tự kiểm tra** — cách tự biết mình làm đúng hay chưa

Tick vào ô `[ ]` khi xong bài. Giai đoạn 1 làm trong thư mục `phase1/`; từ Giai đoạn 2 trở đi làm trong một project duy nhất `task-manager-api/` và xây dần lên. Commit lên GitHub sau mỗi bài.

File chỉ mô tả đầu vào/đầu ra, **không có code lời giải** — phần code là phần bạn tự luyện.

---

# Giai đoạn 1: Node thuần (2 ngày)

📖 **Đọc:** Node.js Design Patterns, chương 6 (Streams)

Cấu trúc thư mục:

```
phase1/
├── data/tasks.json
├── activity.log
└── src/
    ├── cli.js            (Bài 1, 2)
    ├── task-store.js     (Bài 2)
    ├── logger.js         (Bài 2)
    ├── generate-csv.js   (Bài 3)
    ├── count-stream.js   (Bài 3)
    ├── count-readfile.js (Bài 3)
    └── server.js         (Bài 4)
```

## [ ] Bài 1: CLI quản lý task

**Mục tiêu:** quen với đọc/ghi file bất đồng bộ, đọc tham số dòng lệnh qua `process.argv`, và xử lý lỗi đàng hoàng.

**Cần làm:** viết `src/cli.js`, dữ liệu lưu trong `data/tasks.json` bằng `fs/promises`:

```json
[
  { "id": 1, "title": "Mua sữa", "status": "todo", "createdAt": "2026-10-01T09:50:00.000Z", "completedAt": null },
  { "id": 2, "title": "Học streams", "status": "done", "createdAt": "2026-10-01T09:51:00.000Z", "completedAt": "2026-10-01T11:00:00.000Z" }
]
```

| Lệnh | Tác dụng | In ra |
|---|---|---|
| `node src/cli.js add "Mua sữa"` | Tạo task mới, trạng thái `todo` | `Đã thêm task #1: Mua sữa` |
| `node src/cli.js list` | In tất cả task | (xem bên dưới) |
| `node src/cli.js done 1` | Chuyển sang `done`, ghi `completedAt` | `Đã hoàn thành task #1` |
| `node src/cli.js delete 1` | Xóa task | `Đã xóa task #1` |

**Kết quả mong muốn** — lệnh `list` in ra:

```
#1  [ ]  Mua sữa
#2  [x]  Học streams
Tổng: 2 task (1 đã xong)
```

Các trường hợp lỗi phải xử lý:

| Tình huống | Kết quả |
|---|---|
| Không có lệnh (`node src/cli.js`) | In hướng dẫn sử dụng |
| `add` không có title | `Lỗi: thiếu tiêu đề task` |
| `done 99` / `delete 99` khi không có task đó | `Lỗi: không tìm thấy task #99` |
| `done abc` | `Lỗi: id phải là số` |
| `tasks.json` chưa tồn tại | Coi như danh sách rỗng, không crash |
| `tasks.json` sai cú pháp JSON | In lỗi rõ ràng, không in stack trace |

Mọi trường hợp lỗi đều kết thúc với exit code khác 0 (`process.exitCode = 1`).

**Tự kiểm tra:** thêm 3 task, xóa task #2, thêm 1 task mới → task mới phải là **#4**, không phải #3. Nếu bị trùng id, cách sinh id của bạn đang sai.

## [ ] Bài 2: EventEmitter

**Mục tiêu:** tách phần ghi log ra khỏi logic chính — code xử lý task không cần biết có ai đang ghi log.

**Cần làm:**
- `task-store.js`: class `TaskStore extends EventEmitter` với các method `add(title)`, `complete(id)`, `remove(id)`. Chuyển logic đọc/ghi file của Bài 1 vào đây.
- Mỗi method khi thành công phát event `added` / `completed` / `deleted`, kèm dữ liệu task.
- `logger.js`: hàm nhận một `TaskStore`, đăng ký listener cho cả 3 event, mỗi event ghi thêm (append) một dòng vào `activity.log`.
- Sửa `cli.js` để dùng `TaskStore` thay vì đọc/ghi file trực tiếp.

**Kết quả mong muốn** — sau vài lệnh CLI, `activity.log` có dạng:

```
[2026-10-01T09:50:12.345Z] added     #1 "Mua sữa"
[2026-10-01T09:51:03.120Z] added     #2 "Học streams"
[2026-10-01T10:02:44.008Z] completed #1 "Mua sữa"
[2026-10-01T10:05:10.551Z] deleted   #2 "Học streams"
```

**Tự kiểm tra:**
- Xóa dòng gọi logger trong `cli.js` → CLI vẫn chạy bình thường, chỉ không ghi log nữa.
- Trong `task-store.js` không được có chữ `activity.log`. Nếu có, nghĩa là chưa tách được.

## [ ] Bài 3: Streams

**Mục tiêu:** thấy tận mắt khác biệt về bộ nhớ giữa đọc theo stream và đọc cả file một lần; hiểu backpressure.

**Cần làm:**

**Phần A — `generate-csv.js`:** tạo `tasks.csv` 1 triệu dòng, có header:

```
id,title,status,createdAt
1,Task 1,todo,2026-03-14T08:21:00.000Z
2,Task 2,done,2026-07-02T15:40:00.000Z
```

- `status` ngẫu nhiên trong `todo`, `in_progress`, `done`; `createdAt` là ngày ngẫu nhiên trong năm.
- Dùng `fs.createWriteStream`, ghi từng dòng. Khi `write()` trả về `false` thì **dừng lại, chờ event `drain`** rồi mới ghi tiếp — đây là xử lý backpressure.

**Phần B — `count-stream.js`:** đọc bằng `createReadStream` + module `readline`, đếm task theo status.

**Phần C — `count-readfile.js`:** làm y hệt Phần B nhưng dùng `readFile` đọc cả file rồi `split('\n')`.

Cách đo RAM cao nhất: `setInterval` khoảng 50ms đọc `process.memoryUsage().rss`, giữ giá trị lớn nhất, `clearInterval` khi xong.

**Kết quả mong muốn:**
- Phần A: file ~50MB, in `Đã tạo 1,000,000 dòng trong X giây`.
- Phần B và C in cùng format:

```
todo:         333,512
in_progress:  333,201
done:         333,287
Thời gian:    1.2s
RAM cao nhất: 45 MB
```

- Số đếm của B và C **phải giống hệt nhau**; RAM của C cao hơn B nhiều lần.

**Tự kiểm tra:**
- Thử với 5 triệu dòng → khoảng cách RAM còn rõ hơn.
- Bỏ đoạn chờ `drain` ở Phần A rồi đo RAM khi chạy — so với bản có backpressure để hiểu nó dùng để làm gì.

## [ ] Bài 4: HTTP server không dùng framework

**Mục tiêu:** hiểu Express làm hộ mình những gì, để khi học Express thấy rõ giá trị của nó.

**Cần làm:** `server.js` dùng `http.createServer`, cổng 3000, đọc/ghi dữ liệu qua `TaskStore` của Bài 2.
- Mọi response có header `Content-Type: application/json`.
- Tách path và query bằng `new URL(req.url, 'http://localhost')`; tự lấy `:id` từ path.
- Đọc body bằng cách gom các chunk từ `req` (`req` cũng là một readable stream, giống Bài 3).

**Kết quả mong muốn:**

```bash
curl -i localhost:3000/tasks
# 200 — mảng JSON tất cả task

curl -i localhost:3000/tasks/1
# 200 — task id 1; không có thì 404 {"error":"Task not found"}

curl -i -X POST localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Đi chợ"}'
# 201 — task vừa tạo

curl -i -X POST localhost:3000/tasks -d '{title: sai cú pháp'
# 400 {"error":"Invalid JSON"}

curl -i -X POST localhost:3000/tasks -H "Content-Type: application/json" -d '{}'
# 400 {"error":"Title is required"}

curl -i localhost:3000/abc
# 404 {"error":"Route not found"}
```

Server không được crash trong bất kỳ trường hợp nào ở trên.

Nâng cao (không bắt buộc): `GET /tasks?status=done` để lọc; trả 405 khi đúng path sai method (ví dụ `DELETE /tasks`).

**Tự kiểm tra — hoàn thành Giai đoạn 1 khi trả lời được không cần tra:**
1. Backpressure là gì, bỏ qua nó thì chuyện gì xảy ra?
2. Vì sao ở Bài 4 phải gom body từ các chunk thay vì có sẵn `req.body`?

---

# Giai đoạn 2: Express và REST API (5 ngày)

📖 **Đọc:** REST API Design Rulebook (cả cuốn) · Node.js Design Patterns chương 7–8 (Factory, Dependency Injection, Proxy, Decorator)

Từ giai đoạn này, tạo project mới `task-manager-api/` và xây dần đến hết lộ trình.

## [ ] Bài 5: CRUD bằng Express

**Mục tiêu:** thấy Express rút gọn những gì bạn đã phải tự làm ở Bài 4.

**Cần làm:** CRUD cho `tasks`, dữ liệu lưu trong mảng (khởi động lại server thì mất dữ liệu — đó là chủ ý, Giai đoạn 4 sẽ sửa).

| Method + Path | Tác dụng | Thành công |
|---|---|---|
| `GET /tasks` | Lấy tất cả | 200 + mảng |
| `GET /tasks/:id` | Lấy một task | 200 + task |
| `POST /tasks` | Tạo mới | 201 + task vừa tạo |
| `PUT /tasks/:id` | Thay toàn bộ task | 200 + task sau khi sửa |
| `PATCH /tasks/:id` | Sửa một phần (ví dụ chỉ `status`) | 200 + task sau khi sửa |
| `DELETE /tasks/:id` | Xóa | 204, không có body |

**Kết quả mong muốn:** toàn bộ lệnh curl của Bài 4 vẫn chạy đúng; thêm được PUT/PATCH/DELETE; id không tồn tại → 404; route lạ → 404.

**Tự kiểm tra:**
- So số dòng code với Bài 4.
- Liệt kê được ít nhất 3 việc Express làm thay bạn (gợi ý: body, params, header…).
- Phân biệt được PUT và PATCH: gửi PUT thiếu trường thì sao, PATCH thiếu trường thì sao?

## [ ] Bài 6: Middleware

**Mục tiêu:** hiểu middleware chạy theo chuỗi `next()` và thứ tự đăng ký quan trọng thế nào.

**Cần làm:**
- **Logger:** mỗi request in một dòng `GET /tasks 200 12ms` (method, path, status code, thời gian xử lý).
- **Kiểm tra API key:** đọc key từ biến môi trường `API_KEY` (file `.env`); request thiếu hoặc sai header `x-api-key` → 401.
- Thêm route `GET /health` trả `{"status":"ok"}`, **không** cần API key.

**Kết quả mong muốn:**

```
GET /tasks 401 1ms        ← thiếu key, vẫn được log
GET /tasks 200 3ms        ← có key đúng
POST /tasks 201 5ms
GET /health 200 0ms       ← không cần key
```

**Tự kiểm tra:**
- Bẫy: nếu log ngay khi request vừa vào thì chưa biết status code. Logger của bạn phải log **sau khi response gửi xong** (tìm hiểu event `finish` của `res`).
- Request bị chặn 401 vẫn phải xuất hiện trong log → logger phải đứng trước middleware kiểm tra key.

## [ ] Bài 7: Validate và xử lý lỗi tập trung

**Mục tiêu:** mọi lỗi đi về một chỗ, client luôn nhận cùng một format lỗi.

**Cần làm:**
- Dùng zod viết schema khi tạo task:
  - `title`: chuỗi 1–100 ký tự (tự cắt khoảng trắng hai đầu)
  - `priority`: `low` | `medium` | `high`, mặc định `medium`
  - `dueDate`: không bắt buộc, nếu có phải là ngày ở tương lai
- Schema cho PATCH: mọi trường đều không bắt buộc, nhưng phải có ít nhất 1 trường.
- Viết middleware `validate(schema)` dùng lại được cho mọi route.
- Tạo class `AppError` (có `statusCode`, `code`, `message`) và các lỗi con như `NotFoundError`, `ValidationError`.
- Một error middleware (4 tham số) duy nhất chuyển mọi lỗi thành format chung.
- Lỗi trong hàm async phải đến được error middleware. (Express 5 tự làm việc này; nếu dùng Express 4 thì phải tự viết wrapper.)

**Kết quả mong muốn** — mọi lỗi có dạng:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "details": [{ "field": "title", "message": "Tối đa 100 ký tự" }]
  }
}
```

| Tình huống | Status | `code` |
|---|---|---|
| Dữ liệu sai | 400 | `VALIDATION_ERROR` |
| Thiếu/sai API key | 401 | `UNAUTHORIZED` |
| Không tìm thấy | 404 | `NOT_FOUND` |
| Lỗi không lường trước | 500 | `INTERNAL_ERROR` |

Với lỗi 500: client chỉ nhận message chung chung, còn **stack trace đầy đủ được in ở log server**.

**Tự kiểm tra:**
- Tìm chữ `try` trong thư mục controllers → không còn cái nào.
- Cố tình thêm `throw new Error('boom')` vào một route → client nhận 500 format chuẩn, server không chết.
- Gửi `priority: "urgent"`, `title: ""`, `dueDate` là ngày hôm qua → mỗi cái đều 400 với `details` chỉ đúng trường sai.

## [ ] Bài 8: Projects, lọc, sắp xếp, phân trang

**Mục tiêu:** làm việc với quan hệ giữa các resource và query parameters — những thứ API thực tế nào cũng có.

**Cần làm:**
- Resource `projects` (`id`, `name`, `description`, `createdAt`) với CRUD đầy đủ.
- Mỗi task có `projectId` bắt buộc.
- `POST /projects/:id/tasks` — tạo task trong project.
- `GET /projects/:id/tasks` — hỗ trợ query:

| Param | Giá trị hợp lệ | Mặc định |
|---|---|---|
| `status` | `todo`, `in_progress`, `done` | không lọc |
| `sort` | `createdAt`, `-createdAt`, `dueDate`, `-dueDate` (dấu `-` là giảm dần) | `-createdAt` |
| `page` | số nguyên ≥ 1 | 1 |
| `limit` | 1–100 | 10 |

- Query params cũng phải validate bằng zod.
- Xóa project còn task bên trong → 409 Conflict.

**Kết quả mong muốn:**

```json
GET /projects/1/tasks?status=todo&sort=-createdAt&page=2&limit=10

{
  "data": [ ...tối đa 10 task... ],
  "meta": { "page": 2, "limit": 10, "total": 27, "totalPages": 3 }
}
```

| Tình huống | Kết quả |
|---|---|
| Project không tồn tại | 404 |
| `page` vượt quá số trang | 200, `data: []`, `meta` vẫn đúng |
| `limit=500` hoặc `status=abc` | 400 |
| Xóa project còn task | 409 |

**Tự kiểm tra:** tạo 27 task, kiểm tra tay: trang 3 phải có đúng 7 task, `totalPages` = 3.

## [ ] Bài 9: Tách lớp và Dependency Injection

**Mục tiêu:** mỗi lớp chỉ làm một việc; có thể thay cách lưu trữ dữ liệu mà không đụng vào logic.

**Cần làm:** cấu trúc lại project:

```
src/
├── app.js            ← tạo Express app, nhận dependencies từ ngoài vào
├── server.js         ← chỉ gọi app.listen()
├── container.js      ← nơi duy nhất khởi tạo repository/service và nối chúng lại
├── routes/
├── controllers/
├── services/
├── repositories/
├── middlewares/
├── schemas/
└── errors/
```

| Lớp | Được làm | Không được làm |
|---|---|---|
| Route | Gắn URL với controller + middleware | Logic gì khác |
| Controller | Đọc `req`, gọi service, gửi `res` | Quy tắc nghiệp vụ |
| Service | Quy tắc nghiệp vụ (project phải tồn tại, không xóa project còn task…) | Biết đến `req`/`res` |
| Repository | Đọc/ghi dữ liệu | Quy tắc nghiệp vụ |

- `TaskService` nhận repository qua constructor.
- Viết 2 repository có cùng các method (`findMany`, `findById`, `create`, `update`, `delete`):
  - `InMemoryTaskRepository` — lưu trong mảng
  - `JsonFileTaskRepository` — lưu trong `data/tasks.json` (dùng lại kiến thức Bài 1)

**Kết quả mong muốn:**
- Đổi giữa 2 repository bằng cách sửa **đúng 1 dòng** trong `container.js`.
- Cả hai loại đều cho kết quả API y hệt nhau; dùng `JsonFile` thì dữ liệu còn nguyên sau khi khởi động lại server.

**Tự kiểm tra:**
- Tìm `req` hoặc `res` trong `services/` → không có.
- Tìm `fs` ngoài `repositories/` → không có.
- Giải thích được: tách `app.js` khỏi `server.js` sẽ giúp gì cho việc viết test ở Giai đoạn 6?

---

# Giai đoạn 3: TypeScript (4 ngày)

📖 **Đọc:** Programming TypeScript (type, function, class, generics) · Effective TypeScript (20 mục đầu)

## [ ] Bài 10: Luyện type

**Mục tiêu:** thành thạo generics và cách TypeScript tự suy luận type.

**Cần làm:**

**Phần A — type-challenges:** làm các bài mức *easy* trên [github.com/type-challenges/type-challenges](https://github.com/type-challenges/type-challenges): Pick, Readonly, Tuple to Object, First of Array, Length of Tuple, Exclude, Awaited, If, Concat, Includes.

**Phần B — tự viết 3 tiện ích có type đầy đủ:**

1. `groupBy(items, key)` — nhóm mảng theo một thuộc tính.
2. `paginate(items, page, limit)` — trả về `Paginated<T>` dạng `{ data: T[], meta: {...} }` (giống Bài 8).
3. Type `Result<T, E>` — hoặc là thành công kèm `value`, hoặc thất bại kèm `error`. Dùng nó viết hàm `parseTaskId(input: string)`.

**Kết quả mong muốn:**

```ts
const groups = groupBy(tasks, 'status');
// rê chuột vào groups: thấy type được suy ra là nhóm của Task[], không phải any

groupBy(tasks, 'abc');
// ❌ lỗi biên dịch: 'abc' không phải thuộc tính của Task

const page = paginate(tasks, 1, 10);
page.data[0].title;          // ✅ TS biết đây là Task

const r = parseTaskId('abc');
r.value;                     // ❌ lỗi biên dịch: phải kiểm tra thành công/thất bại trước
if (r.ok) r.value;           // ✅ number
```

**Tự kiểm tra:** không dùng `any` hay `as` để ép type ở bất kỳ đâu; mọi type trả về đều do TS tự suy ra đúng.

## [ ] Bài 11: Discriminated union

**Mục tiêu:** dùng type system để chặn bug ngay lúc viết code, thay vì lúc chạy.

**Cần làm:**
- Mô hình hóa task theo trạng thái:
  - `todo` — không có thêm trường
  - `in_progress` — có thêm `startedAt`
  - `done` — có thêm `startedAt` và `completedAt`
- Viết hàm `describeTask(task)` trả về chuỗi mô tả bằng `switch` trên `status`, có nhánh kiểm tra "đã xử lý hết mọi trường hợp" (tìm hiểu về type `never`).

**Kết quả mong muốn:**

```ts
describeTask(todoTask)        // "Chưa bắt đầu"
describeTask(inProgressTask)  // "Đang làm từ 01/10 09:00"
describeTask(doneTask)        // "Hoàn thành lúc 01/10 11:00"

todoTask.completedAt          // ❌ lỗi biên dịch
```

**Tự kiểm tra:** thêm trạng thái mới `cancelled` vào union → TS phải báo lỗi ở `describeTask` cho đến khi bạn thêm nhánh xử lý.

## [ ] Bài 12: Chuyển project sang TypeScript

**Mục tiêu:** áp dụng TS vào một codebase thật, không phải ví dụ rời.

**Cần làm:**
- `tsconfig.json` bật `strict: true`.
- Scripts trong `package.json`:
  - `dev` — chạy bằng `tsx watch`
  - `build` — biên dịch bằng `tsc` ra thư mục `dist/`
  - `start` — chạy `node dist/server.js`
- Type cho input lấy bằng `z.infer<typeof schema>`, không khai báo lại lần thứ hai.
- Tạo interface `TaskRepository`; cả hai repository của Bài 9 phải `implements` interface đó.
- Gõ type cho `params`, `query`, `body` trong controller.

**Kết quả mong muốn:**
- `npm run build` → 0 lỗi.
- Chạy lại toàn bộ lệnh curl của Bài 5–8 → kết quả y hệt bản JS.

**Tự kiểm tra:**
- Tìm `any`, `@ts-ignore`, `@ts-expect-error` → không có.
- Cố tình xóa một method khỏi `InMemoryTaskRepository` → TS báo lỗi ngay.
- Đổi một trường trong zod schema → TS báo lỗi ở những chỗ dùng sai, không cần sửa type bằng tay.

---

# Giai đoạn 4: Database (6 ngày)

📖 **Đọc:** Learning SQL (bỏ phần đã biết) · The Art of PostgreSQL (phần schema design)

## [ ] Bài 13: Viết SQL thuần

**Mục tiêu:** viết được SQL bằng tay trước khi dùng ORM, để hiểu ORM đang làm gì phía sau.

**Cần làm:**
- Cài PostgreSQL, dùng psql hoặc DBeaver.
- `sql/schema.sql`: tạo bảng `users`, `projects`, `tasks`, `labels`, `task_labels`.
- `sql/seed.sql`: dữ liệu mẫu nhỏ (~5 user, 10 project, 50 task), cố ý tạo đủ tình huống: task quá hạn, project không có task, task có nhiều label.
- `sql/queries.sql`: 8 query, mỗi query có comment ghi câu hỏi:

| # | Câu hỏi | Kiến thức gợi ý |
|---|---|---|
| 1 | Task chưa xong của một user, sắp theo hạn gần nhất | `WHERE`, `ORDER BY` |
| 2 | Số task trong mỗi project (kể cả project có 0 task) | `LEFT JOIN`, `GROUP BY` |
| 3 | Project chưa có task nào | `LEFT JOIN … IS NULL` |
| 4 | User có nhiều task quá hạn nhất | `JOIN`, `GROUP BY`, `LIMIT` |
| 5 | Tỉ lệ hoàn thành (%) từng project | `COUNT … FILTER` hoặc `CASE` |
| 6 | Các task gắn label `urgent` | `JOIN` 3 bảng |
| 7 | Top 3 project nhiều task được tạo nhất tháng này | `date_trunc` |
| 8 | Số task hoàn thành theo từng ngày trong 7 ngày gần nhất (ngày nào 0 cũng phải hiện) | `generate_series` |

**Kết quả mong muốn:** cả 8 query chạy được và cho kết quả đúng với dữ liệu seed.

**Tự kiểm tra:**
- Đếm tay vài kết quả để đối chiếu.
- Bẫy ở query 2: project không có task phải hiện ra với số **0**, không phải 1 và không bị mất dòng.
- Bẫy ở query 8: phải đủ **7 dòng** kể cả ngày không có task nào hoàn thành.

## [ ] Bài 14: Index

**Mục tiêu:** hiểu index giúp gì và đọc được kết quả `EXPLAIN ANALYZE`.

**Cần làm:**
- Sinh 1 triệu task bằng `generate_series`.
- Chạy `EXPLAIN ANALYZE` cho query số 1, ghi lại plan và thời gian.
- Tạo index phù hợp (gợi ý: thử index nhiều cột), chạy lại.
- Thử tạo thêm một index **vô ích** (ví dụ trên cột `title`) và xem PostgreSQL có dùng nó không.

**Kết quả mong muốn:** file `sql/index-notes.md` ghi:

```
Query 1 — trước khi có index: Seq Scan, 180 ms
Index đã tạo: ...
Query 1 — sau khi có index: Index Scan, 0.4 ms
Index trên title: không được dùng, vì ...
```

(Số liệu trên chỉ là ví dụ, của bạn sẽ khác.)

**Tự kiểm tra:** giải thích được vì sao index giúp đọc nhanh hơn nhưng lại làm ghi chậm đi, và vì sao không nên đánh index cho mọi cột.

## [ ] Bài 15: Thiết kế schema

**Mục tiêu:** tự ra quyết định thiết kế và ghi lại lý do.

**Cần làm:** thiết kế lại schema hoàn chỉnh cho project:

| Bảng | Ghi chú |
|---|---|
| `users` | `email` không được trùng |
| `projects` | |
| `project_members` | Quan hệ n-n giữa user và project, có cột `role` (`owner` / `member`); một user chỉ là thành viên một lần trong mỗi project |
| `tasks` | Thuộc một project; có `assignee_id` (có thể để trống) |
| `labels` | Tên label không trùng trong cùng một project |
| `task_labels` | Quan hệ n-n giữa task và label |

**Kết quả mong muốn:**
- Sơ đồ ERD (vẽ trên dbdiagram.io hoặc giấy rồi chụp), lưu link/ảnh trong `docs/`.
- File `docs/schema-decisions.md` trả lời:
  1. Xóa một user thì `project_members`, `tasks` (task họ được giao), project họ làm owner sẽ ra sao?
  2. Xóa một project thì task và label bên trong ra sao?
  3. Ràng buộc nào được đặt ở database (`UNIQUE`, `CHECK`, `FOREIGN KEY`), ràng buộc nào để code xử lý? Vì sao?

**Tự kiểm tra:** thử `INSERT` dữ liệu sai (email trùng, status lạ, task trỏ tới project không tồn tại) → database phải từ chối.

## [ ] Bài 16: Prisma

**Mục tiêu:** dùng ORM có type, và chứng minh thiết kế ở Bài 9 cho phép thay database mà không sửa logic.

**Cần làm:**
- Cài Prisma, làm theo hướng dẫn Getting Started trên trang chính thức (cách setup thay đổi theo phiên bản).
- Chuyển thiết kế Bài 15 sang `schema.prisma`, chạy migration.
- Viết `PrismaTaskRepository` và `PrismaProjectRepository`, implement đúng interface của Bài 12.
- Đổi repository trong `container.ts`.

**Kết quả mong muốn:**
- Toàn bộ curl của Bài 5–8 chạy đúng; dữ liệu còn sau khi khởi động lại.
- Mở Prisma Studio thấy được dữ liệu.

**Tự kiểm tra:** `git diff` cho thấy **không có thay đổi nào** trong thư mục `services/`.

## [ ] Bài 17: Transaction, N+1 và seed

**Mục tiêu:** hiểu transaction, phát hiện và sửa lỗi N+1, sinh dữ liệu lớn để test.

**Cần làm:**

**Phần A — Transaction:** thêm bảng `activities` (ghi lại lịch sử thao tác). Endpoint `POST /tasks/:id/move` với body `{ "targetProjectId": 5 }`:
- Kiểm tra task và project đích tồn tại (không có → 404).
- Cập nhật `projectId` của task **và** ghi một dòng vào `activities` — hai việc này nằm trong cùng một transaction.

**Phần B — N+1:** `GET /projects` trả về mỗi project kèm `taskCount` và `doneCount`.
- Bật log query của Prisma.
- Viết cách "ngây thơ" trước: lấy danh sách project, rồi đếm task cho từng project. Ghi lại số query.
- Sửa lại để số query không phụ thuộc số project.

**Phần C — Seed:** `prisma/seed.ts` dùng `@faker-js/faker` tạo 50 user, 200 project, 10.000 task kèm label. Chạy lại nhiều lần không bị lỗi trùng dữ liệu (xóa dữ liệu cũ trước khi seed).

**Kết quả mong muốn:**

```
Phần B, cách ngây thơ — 200 project → 201 query
Phần B, sau khi sửa  — 200 project → 1–2 query
Seed xong: 50 users, 200 projects, 10000 tasks trong ~X giây
```

**Tự kiểm tra:**
- Phần A: cố tình `throw` lỗi giữa hai bước → task **không** bị chuyển và **không** có dòng activity nào được ghi.
- Phần B: tăng lên 400 project, số query vẫn giữ nguyên.

---

# Giai đoạn 5: Xác thực và bảo mật (3 ngày)

📖 **Đọc:** Web Application Security (các chương về authentication, injection, XSS)

## [ ] Bài 18: Đăng ký và đăng nhập

**Mục tiêu:** làm đúng luồng xác thực bằng JWT, gồm cả refresh token và đăng xuất.

**Cần làm:**
- Bảng `users` thêm `passwordHash`, `role` (`user` / `admin`).
- Bảng `refresh_tokens`: `userId`, token (nên lưu bản hash, không lưu nguyên), `expiresAt`, `revokedAt`.
- Mật khẩu hash bằng bcrypt. Access token hết hạn sau 15 phút, refresh token sau 7 ngày.
- Bỏ middleware `x-api-key` của Bài 6, thay bằng middleware `requireAuth` đọc header `Authorization: Bearer <token>`.

| Endpoint | Thành công | Lỗi |
|---|---|---|
| `POST /auth/register` `{email, password, name}` | 201 + thông tin user | Email trùng → 409; mật khẩu < 8 ký tự → 400 |
| `POST /auth/login` `{email, password}` | 200 `{accessToken, refreshToken}` | Sai → 401 |
| `POST /auth/refresh` `{refreshToken}` | 200 + cặp token **mới**, token cũ bị thu hồi | Token sai/hết hạn/đã dùng → 401 |
| `POST /auth/logout` `{refreshToken}` | 204, token bị thu hồi | |
| `GET /auth/me` | 200 + user đang đăng nhập | Không có token → 401 |

**Kết quả mong muốn:**
- Response **không bao giờ** chứa `passwordHash`.
- Đăng nhập sai email hay sai mật khẩu đều trả **cùng một thông báo** (không để lộ email nào đã đăng ký).
- Trong database, mật khẩu là chuỗi hash (bắt đầu bằng `$2b$`), không phải mật khẩu gốc.

**Tự kiểm tra:**
- Dùng refresh token → được cặp mới. Dùng lại **token cũ** lần nữa → 401.
- Logout xong, dùng refresh token đó → 401.
- Đợi access token hết hạn (hoặc tạm đặt hạn 10 giây để test) → 401, refresh lại thì dùng tiếp được.

## [ ] Bài 19: Phân quyền

**Mục tiêu:** phân biệt "bạn là ai" (authentication) với "bạn được làm gì" (authorization).

**Cần làm:** người tạo project tự động thành `owner`. Áp dụng bảng quyền:

| Hành động | owner | member | không phải thành viên | admin |
|---|:-:|:-:|:-:|:-:|
| Xem project và task | ✅ | ✅ | ❌ | ✅ |
| Tạo / sửa task | ✅ | ✅ | ❌ | ✅ |
| Sửa thông tin project | ✅ | ❌ | ❌ | ✅ |
| Thêm / xóa thành viên | ✅ | ❌ | ❌ | ✅ |
| Xóa project | ✅ | ❌ | ❌ | ✅ |

- `GET /projects` chỉ trả về project mà user là thành viên; admin thấy tất cả.
- Không có quyền → 403. (Hoặc 404 nếu bạn muốn giấu luôn việc project tồn tại — chọn một cách và ghi lý do vào `docs/`.)
- Endpoint chuyển task của Bài 17 giờ phải yêu cầu user là thành viên của **cả hai** project.
- Việc kiểm tra quyền nằm ở **service**, không nằm ở controller.

**Kết quả mong muốn** — test thủ công với 3 tài khoản A (owner), B (member), C (không liên quan):

| Thao tác | A | B | C |
|---|---|---|---|
| Xem project của A | 200 | 200 | 403 |
| Tạo task trong project | 201 | 201 | 403 |
| Xóa project | 204 | 403 | 403 |

**Tự kiểm tra:** C thử đoán id và gọi thẳng `GET /projects/:id/tasks`, `PATCH /tasks/:id` của A → đều bị chặn. Không có endpoint nào lọt.

## [ ] Bài 20: Tự tấn công API của mình

**Mục tiêu:** nghĩ như người tấn công để tìm lỗ hổng trước khi người khác tìm ra.

**Cần làm:**
- Thêm `helmet`.
- CORS chỉ cho phép các domain khai báo trong biến môi trường `CORS_ORIGINS`.
- Giới hạn đăng nhập: 5 lần/phút/IP.
- Giới hạn kích thước body (ví dụ 100kb).
- Ở môi trường production, lỗi trả về không chứa stack trace.

**Kết quả mong muốn** — ghi kết quả từng phép thử vào `docs/security-checklist.md`:

| Phép thử | Kết quả mong muốn |
|---|---|
| Đăng nhập sai 6 lần liên tiếp | Lần 6 → 429, có header `Retry-After` |
| Gửi body 10MB | 413 |
| `?status=done' OR '1'='1` | 400 (bị zod chặn) |
| `title` chứa `<script>alert(1)</script>` | Lưu như văn bản bình thường; response là JSON với đúng `Content-Type` |
| Token đã hết hạn | 401 |
| Token bị sửa 1 ký tự | 401 |
| Gọi API từ một domain không có trong `CORS_ORIGINS` (trên trình duyệt) | Bị trình duyệt chặn |
| Gây lỗi 500 khi `NODE_ENV=production` | Không lộ stack trace, không lộ câu SQL |

**Tự kiểm tra:** giải thích được vì sao chuỗi `<script>` lưu trong database không nguy hiểm với API, và trách nhiệm chống XSS thực ra nằm ở đâu.

---

# Giai đoạn 6: Testing (2 ngày)

## [ ] Bài 21: Unit test

**Mục tiêu:** test logic nghiệp vụ nhanh, không cần database hay mạng.

**Cần làm:** dùng Vitest, test `TaskService` và `ProjectService` với repository giả (`InMemory` của Bài 9 hoặc dùng mock). Tối thiểu 10 test:

1. Tạo task thành công
2. Tạo task trong project không tồn tại → `NotFoundError`
3. Hoàn thành task → có `completedAt`
4. Hoàn thành task đã xong rồi → (bạn tự quyết định hành vi, và test đúng hành vi đó)
5. Xóa project còn task → lỗi Conflict
6. Chuyển task sang project khác thành công
7. Chuyển task sang project không tồn tại → `NotFoundError`
8. Phân trang tính đúng `totalPages` (thử 0, 10, 27 task)
9. User không phải thành viên → lỗi Forbidden
10. Admin được phép dù không phải thành viên

**Kết quả mong muốn:**

```
✓ TaskService (8)
✓ ProjectService (4)
Test Files  2 passed
Tests  12 passed
Duration  0.8s
```

**Tự kiểm tra:** cố tình làm sai một quy tắc trong service (ví dụ bỏ kiểm tra quyền) → ít nhất một test phải đỏ. Nếu không test nào đỏ, test của bạn chưa đủ.

## [ ] Bài 22: Integration test

**Mục tiêu:** test toàn bộ đường đi từ HTTP request tới database thật.

**Cần làm:**
- Database riêng cho test (cấu hình trong `.env.test`), dọn sạch trước mỗi file test.
- Dùng `supertest` gọi thẳng vào `app` (không cần `listen` — đây là lý do tách `app` và `server` ở Bài 9).
- Các kịch bản:
  1. Đăng ký → đăng nhập → tạo project → tạo task → xem danh sách task
  2. User khác đăng nhập → không xem/sửa được project trên
  3. Gửi dữ liệu sai → 400 đúng format lỗi
  4. Refresh token → logout → refresh lại bị từ chối

**Kết quả mong muốn:**
- `npm test` chạy cả unit và integration, tất cả đều xanh.
- `vitest --coverage`: thư mục `services/` đạt ≥70%.

**Tự kiểm tra:** chạy test 2 lần liên tiếp → kết quả giống nhau (test không phụ thuộc dữ liệu còn sót lại của lần trước).

---

# Giai đoạn 7: Hoàn thiện và triển khai (4 ngày)

## [ ] Bài 23: Chuẩn bị chạy thật

**Mục tiêu:** app đủ tin cậy để chạy trên server thật.

**Cần làm:**
- **Logging:** dùng Pino (+ `pino-http`) thay mọi `console.log`. Môi trường dev in dễ đọc; production in JSON. Mỗi request có một request id; khi có lỗi thì id này cũng xuất hiện trong response lỗi.
- **Validate biến môi trường** bằng zod ngay khi khởi động: `NODE_ENV`, `PORT`, `DATABASE_URL`, `JWT_SECRET` (tối thiểu 32 ký tự), `CORS_ORIGINS`.
- **Health check:** `GET /health` chạy thử một câu `SELECT 1`.
- **Graceful shutdown:** khi nhận `SIGTERM`/`SIGINT`, ngừng nhận request mới, chờ request đang xử lý xong, ngắt kết nối database rồi thoát.

**Kết quả mong muốn:**

```
$ DATABASE_URL= npm start
Lỗi cấu hình môi trường:
  - DATABASE_URL: bắt buộc
  - JWT_SECRET: tối thiểu 32 ký tự
(thoát với exit code 1)
```

| Tình huống | `/health` |
|---|---|
| Mọi thứ bình thường | 200 `{"status":"ok","db":"ok"}` |
| Tắt PostgreSQL | 503 `{"status":"error","db":"down"}` |

**Tự kiểm tra:** gửi một request chạy chậm (tạm thêm `setTimeout` 5 giây), bấm Ctrl+C ngay → request đó vẫn nhận được response rồi server mới tắt.

## [ ] Bài 24: Docker

**Mục tiêu:** bất kỳ ai cũng chạy được project bằng một lệnh.

**Cần làm:**
- `Dockerfile` multi-stage (cài dependencies → build → image chạy gọn nhẹ), chạy bằng user không phải root.
- `.dockerignore` (loại `node_modules`, `.env`, `dist`…).
- `docker-compose.yml` gồm `app` và `postgres`:
  - PostgreSQL dùng volume để giữ dữ liệu, có healthcheck.
  - `app` chỉ khởi động khi database đã sẵn sàng, tự chạy `prisma migrate deploy` trước khi start.
- `.env.example` liệt kê đủ biến môi trường cần thiết.

**Kết quả mong muốn:**

```bash
git clone <repo> && cd task-manager-api
cp .env.example .env
docker compose up
# → API chạy ở localhost:3000, không cần cài Node hay PostgreSQL trên máy
```

- `docker images` → image của app < 200MB.

**Tự kiểm tra:**
- `docker compose down` rồi `up` lại → dữ liệu vẫn còn.
- `docker compose down -v` → dữ liệu mất (hiểu được volume làm gì).
- Nhờ một người bạn clone về chạy thử trên máy họ.

## [ ] Bài 25: Deploy

**Mục tiêu:** đưa API lên internet, ai cũng gọi được.

**Cần làm:**
- Deploy lên Railway hoặc Render, dùng PostgreSQL do nền tảng cung cấp.
- Cấu hình biến môi trường trên nền tảng (không commit `.env`).
- Migration tự chạy mỗi lần deploy; health check trỏ vào `/health`.
- Viết `README.md`: giới thiệu, link API, danh sách endpoint, cách chạy local.

**Kết quả mong muốn:**
- Có URL công khai, ví dụ `https://task-manager-xxx.up.railway.app/health` → 200.
- Push một commit lên GitHub → nền tảng tự deploy bản mới.
- Một người bạn đăng ký được tài khoản và tạo task thông qua URL đó.

**Tự kiểm tra:** xem được log của app trên nền tảng; cố tình gây một lỗi 500 → tìm được dòng log tương ứng bằng request id.

## [ ] Bài 26: Redis và hàng đợi

**Mục tiêu:** làm quen với cache và xử lý tác vụ nền — hai thứ gần như hệ thống nào lớn lên cũng cần.

**Cần làm:**

**Phần A — Cache:** endpoint `GET /projects/:id/stats` trả về:

```json
{ "total": 120, "byStatus": { "todo": 40, "in_progress": 20, "done": 60 }, "overdue": 7, "completionRate": 0.5 }
```

- Cache kết quả trong Redis, thời hạn 60 giây.
- Khi có task trong project thay đổi (tạo/sửa/xóa/chuyển) → xóa cache của project đó.
- Nếu Redis bị tắt → API vẫn trả kết quả (đọc thẳng từ database), không lỗi.

**Phần B — Hàng đợi:** dùng BullMQ, chạy worker trong một process riêng (`worker.ts`).
- Job chạy định kỳ mỗi giờ: tìm các task chưa xong, đến hạn trong 24 giờ tới, chưa được nhắc.
- Với mỗi task, ghi log nhắc nhở (chưa cần gửi email thật), rồi đánh dấu `remindedAt` để không nhắc lại.
- Thêm `redis` và `worker` vào `docker-compose.yml`.

**Kết quả mong muốn:**

```
GET /projects/1/stats   cache miss   48ms
GET /projects/1/stats   cache hit     2ms
PATCH /tasks/15         → xóa cache project 1
GET /projects/1/stats   cache miss   45ms   (số liệu đã cập nhật)

[worker] Nhắc user an@example.com: task "Nộp báo cáo" đến hạn lúc 01/10 17:00
```

**Tự kiểm tra:**
- Tạo task đến hạn sau 2 giờ, kích hoạt job → đúng 1 dòng nhắc. Chạy job lần nữa → không nhắc lại.
- `docker compose stop redis` → `/stats` vẫn chạy.

---

# Sau lộ trình

- **Node.js Design Patterns:** chương 9 (Behavioral) khi muốn nâng chất lượng code; chương 11–13 (Advanced Recipes, Scalability, Messaging) khi bắt đầu quan tâm đến hệ thống lớn. Chương 10 (Universal JavaScript) thiên về frontend, có thể bỏ qua.
- **Designing Data-Intensive Applications:** đọc chậm, 1–2 chương mỗi tuần.
- **Project thứ hai, tự làm không theo hướng dẫn:** ví dụ dịch vụ rút gọn link hoặc hệ thống đặt lịch hẹn. Tự viết yêu cầu theo format Mục tiêu / Cần làm / Kết quả mong muốn như file này.

# Khi bị bí

1. Đọc lại đề, chia nhỏ vấn đề
2. Tra tài liệu chính thức (Node, Express, zod, Prisma…)
3. Tra lại sách
4. Hỏi xin **gợi ý hướng đi**, không xin code hoàn chỉnh — tự gõ ra mới thật sự luyện được

> 💡 Commit lên GitHub sau mỗi bài. Cuối lộ trình, repo `task-manager-api` chính là portfolio đầu tiên của bạn.