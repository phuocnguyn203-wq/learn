function toErrorMessage(error: unknown) {
  if (error instanceof Error) { return error.message; }
  if (typeof error === "string") { return error; }
  if (error !== null && typeof error === "object") {
    if ("message" in error && typeof error["message"] === "string") { return `${error.message}`; }
    if ("code" in error && typeof error["code"] === "number") { return `Error code: ${error.code}`; }
  }

  return "Undefined error";
}

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
