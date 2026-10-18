# Ghi chú Bài 12: Chuyển project sang TypeScript

## 1. Zod là nguồn duy nhất của type

- Type lấy bằng `z.infer<typeof Schema>`, không khai báo lại bằng tay. Đổi schema thì TS tự báo lỗi ở những chỗ dùng sai.
- Nên export type ngay trong file schema, nơi khác dùng `import type`.
- `z.infer` là type **sau khi parse**. Nếu schema có `.default()`, `z.coerce`, `.transform()` thì type trước khi parse khác type sau khi parse. Type trước khi parse là `z.input<typeof Schema>`.
- Hai type khác nhau cho cùng một thứ (schema + type viết tay) sẽ có ngày lệch nhau. Ví dụ: schema ghi `completedAt` là `.optional()`, type viết tay ghi `string | null`. Cách tốt nhất là suy ra type từ schema:
  ```ts
  type TaskData = Omit<z.infer<typeof StoredTask>, "id">;
  ```

## 2. Input ≠ dữ liệu lưu trữ: mỗi tầng một việc

| Tầng | Type | Việc làm |
|---|---|---|
| Controller | `TaskCreateInput` (client gửi lên) | parse request |
| Service | `TaskCreateInput` → `TaskData` | điền mặc định (`status: "todo"`, `createdAt`, `completedAt`), đổi `Date` → `string` |
| Repository | `TaskData` → `TaskData & { id }` | gắn `id`, lưu |

- Quy tắc nghiệp vụ (task mới là `todo`) đặt ở **service**, không ở repository, để không phải lặp lại ở mỗi repository.
- `dueDate` lưu dạng **chuỗi ISO**, vì file JSON chỉ lưu được string. Chuỗi ISO so sánh trực tiếp được theo thời gian.
- `update` cũng phải chuyển đổi giống `create`. Quên bước này thì `Date` lọt vào bộ nhớ (bug 2).

## 3. Generic

- Constraint: `class Repo<T extends { id: number }>` nghĩa là T phải **ít nhất** có `id: number`.
- Code generic chỉ **đọc** được những gì constraint đảm bảo. Nó **không tạo ra** được T mới, vì TS phải đúng với **mọi** T:
  ```ts
  type Weird = { id: 5; name: string };  // thỏa constraint
  // create() sinh ra { id: 6, ... } → không phải Weird → TS từ chối
  ```
- Cách giải quyết: cho generic là phần **không có id**, còn class tự gắn `id`:
  ```ts
  class InMemoryRepository<T> {
    items: (T & { id: number })[];
    async create(data: T) { const item = { id: this.getNewId(), ...data }; ... } // ✅
  }
  ```
- Class con dùng cho một type cụ thể thì truyền type thẳng vào: `extends InMemoryRepository<TaskData>`.

## 4. Interface cho repository

- Service phụ thuộc vào **interface** (`TaskRepository`), không phụ thuộc vào class. Như vậy đổi cách lưu trữ thì không phải sửa service.
- Interface chung dùng generic: `interface Repository<T>`, rồi `TaskRepository extends Repository<TaskData>` thêm method riêng.
- Type trả về phải có `id` (`T & { id: number }`), nếu không TS nghĩ dữ liệu không có `id`.
- Nên đặt `implements` ở class gốc (`InMemoryTaskRepository`). Class con kế thừa thì tự thỏa interface, và lỗi được báo đúng chỗ.
- Interface nằm trong file riêng (`repository.types.ts`) để service không phải import từ file chứa phần cài đặt.

## 5. Mở rộng type của thư viện (declaration merging)

- Merge chỉ xảy ra khi **cùng tên + cùng phạm vi**. Khai báo `interface Request` trong một file có `import`/`export` chỉ tạo ra interface mới, cục bộ trong file đó.
- Muốn thêm `req.validated` vào `Request` của Express:
  ```ts
  // src/types/express.d.ts
  export {};
  declare global {
    namespace Express {
      interface Request { validated?: { body?: unknown; query?: unknown; params?: unknown } }
    }
  }
  ```

## 6. Các quy tắc type dễ nhầm

- **`&` không ghi đè trường trùng tên mà giao type của trường đó**: `{ dueDate?: Date } & { dueDate: string }` cho ra `dueDate: Date & string`, không giá trị nào thỏa được. Muốn đổi type của một trường thì `Omit` trường cũ trước.
- **`.optional()` và `.nullable()`**: `optional` là có thể không có trường (`undefined`); `nullable` là luôn có trường nhưng giá trị có thể là `null`.
- **Excess property check**: gán **trực tiếp một object literal** có property thừa thì TS báo lỗi; gán qua biến thì không. Muốn thêm trường thì tạo biến mới có type đúng (`const fields: Partial<TaskData> = { ...rest }`).
- **Thu hẹp type mà không cần `as`**: viết sao cho TS tự suy ra type hẹp.
  ```ts
  const key = sort.endsWith("createdAt") ? "createdAt" : "dueDate"; // "createdAt" | "dueDate"
  ```
- **TS không cho trừ hai `Date`**: dùng `.getTime()`, hoặc so sánh chuỗi ISO.

## 7. `as` không kiểm tra gì cả

`as` chỉ **khẳng định** với TS, không **kiểm tra** dữ liệu. Hai bug thật đã bị `as` che:
- **Bug 1**: `req.validated!.params as ProjectCreateInput` đọc nhầm `params` thay vì `body`. TS tin lời khẳng định nên không báo gì, server crash lúc chạy.
- **Bug 2**: `TaskUpdateInput` viết tay có `dueDate: string`, nhưng zod trả về `Date`. `Date` lọt vào bộ nhớ, sort so sánh `Date >= string` ra `NaN`, kết quả sai. Khởi động lại thì hết lỗi, vì file JSON lưu dạng string. Đây là loại bug rất khó tìm.

## 8. Dữ liệu từ bên ngoài phải được kiểm tra

- `JSON.parse` trả về `any`, nên lỗ hổng `any` lọt vào mà không cần gõ chữ `any`.
- Cách đúng: đặt type `unknown`, rồi parse bằng zod.
  ```ts
  async function loadJson<S extends z.ZodType>(filename: string, schema: S): Promise<z.infer<S>> {
    const text = await readFile(filename, "utf8");
    const data: unknown = text.length === 0 ? [] : JSON.parse(text);
    return schema.parse(data); // sai → báo lỗi ngay lúc khởi động
  }
  ```
- Schema cho dữ liệu đã lưu phải bỏ những rule chỉ dành cho input. Ví dụ: "ngày phải ở tương lai" không áp dụng cho task cũ.

## 9. Các bẫy khi chạy

- **`Object.assign` chép cả giá trị `undefined`**: `fields.dueDate = dueDate?.toISOString()` sẽ xóa `dueDate` cũ khi client không gửi trường này. Phải dùng `if` để chỉ thêm khi có giá trị.
- **Hàm so sánh của `sort`**: a đứng trước thì trả về số âm, b đứng trước thì số dương, **bằng nhau thì trả về `0`**. Thiếu nhánh `0` thì hàm tự mâu thuẫn và thứ tự sort khó đoán. So sánh với `NaN` luôn là `false`.
- **Error handler của Express phải có đúng 4 tham số** (`err, req, res, next`), kể cả khi không dùng `next`. Thiếu một tham số thì Express coi đó là middleware thường, và lỗi rơi xuống handler mặc định trả về trang HTML.

## 10. Công cụ và đường dẫn

- `npx tsc --noEmit`: chỉ kiểm tra type, không tạo file. Thêm `--watch` để kiểm tra liên tục.
- `tsx` (`npm run dev`) **không kiểm tra type**, chỉ bỏ phần type đi rồi chạy.
- `tsc` giữ nguyên cấu trúc thư mục tính từ `rootDir`. Với `rootDir: "."`, file ra nằm ở `dist/practice/src/server.js`.
- `tsc` **không copy** file không phải TS (`.env`) sang `dist`.
- `readFile` và `loadEnvFile` hiểu đường dẫn tương đối theo **thư mục chạy lệnh** (`process.cwd()`), không theo vị trí file code. Luôn chạy lệnh từ thư mục `learn`.

## 11. Script test (bash)

- Biến không đặt vẫn được gửi thành chuỗi rỗng (`status=`). Chuỗi rỗng khác `undefined`, nên zod báo lỗi. Chỉ thêm tham số khi biến có giá trị.
- Script bash trên Windows phải dùng kiểu xuống dòng LF, không dùng CRLF.
- Test cả các trường hợp lỗi (400, 401, 404, 409), vì kết quả phải giống hệt bản JS.

## Còn để làm

- [ ] Bỏ `!` và `as` trong controller. Hướng làm: controller tự `Schema.parse(...)`, hoặc dùng generic `Request<Params, ResBody, Body, Query>`.
- [ ] Suy ra `TaskData` / `ProjectData` từ `StoredTask` / `StoredProject` thay vì viết tay.
- [ ] Chạy `npm run build` + `npm start`, chạy lại toàn bộ curl và so với bản JS.
