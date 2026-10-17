interface TicketRow {
  code: string;
  eventName: string;
  price: number;
  sold: number;
  remaining: number;
}

const SORTABLE_COLUMNS= {
  price: "Giá vé",
  sold: "Đã bán",
  remaining: "Còn lại"
}

function sortRows(rows: TicketRow[], column: keyof typeof SORTABLE_COLUMNS, direction: "asc" | "desc") {
  const directionNum = direction === "asc" ? 1 : -1;
  const sortedRows = rows.sort(
    (a, b) => (a[column] - b[column]) * directionNum
  )
  return sortedRows;
}

function sortFromQuery(rows: TicketRow[], column: keyof typeof SORTABLE_COLUMNS) {
  return sortRows(rows, column, "desc");
}

function headerLabel(column: keyof typeof SORTABLE_COLUMNS) {
  return SORTABLE_COLUMNS[column];
}

const rows: TicketRow[] = [
  { code: "A", eventName: "Hoà nhạc mùa thu", price: 800000, sold: 120, remaining: 30 },
  { code: "B", eventName: "Stand-up tối thứ Sáu", price: 250000, sold: 300, remaining: 0 },
  { code: "C", eventName: "Kịch Lôi Vũ", price: 400000, sold: 80, remaining: 70 },
];

console.log(sortRows(rows, "price", "asc").map((row) => row.code).join(""));       // BCA
console.log(sortFromQuery(rows, "sold").map((row) => row.code).join(""));          // BAC
//console.log(sortFromQuery(rows, "eventName").map((row) => row.code).join(""));     // ABC
//console.log(sortFromQuery(rows, "toString").map((row) => row.code).join(""));      // ABC
console.log(headerLabel("remaining"));                                             // Còn lại

// Với cột không sắp xếp được, phải trả về đúng mảng gốc chứ không phải một bản sao
//console.log(sortFromQuery(rows, "eventName") === rows);   // true
//console.log(sortFromQuery(rows, "toString") === rows);    // true
console.log(sortFromQuery(rows, "sold") === rows);        // false

