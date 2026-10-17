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

const users: User[] = [
  {id: "u1", name: "Thu Hà"}
];

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
  // same here can't read find of undefined
  const seat = seatMap.get(seatId);
  if (seat === undefined) {
    return `Không tìm thấy ghế ${seatId}`;
  }

  const user = users.find((u) => u.id === seat.heldBy);
  if (user === undefined) {
    if (seat.heldBy !== undefined) {
      return `Không rõ người giữ`
    }
    return `Ghế ${seatId} chưa có người giữ`;
  }

  return user.name;
}

console.log(holdSeat("A1", "u1"));   // Đã giữ ghế A1
console.log(holdSeat("A1", "u2"));   // Ghế A1 không còn trống
console.log(holdSeat("Z9", "u1"));   // Không tìm thấy ghế Z9
console.log(holderName("A1"));       // Thu Hà
console.log(holderName("A2"));       // Thu Hà
console.log(holderName("A3"));       // Không rõ người giữ
console.log(holderName("A4"));       // Ghế A4 chưa có người giữ
console.log(holderName("Z9"));       // Không tìm thấy ghế Z9

