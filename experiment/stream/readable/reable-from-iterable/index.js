import { Readable } from "node:stream";
const chars = [
  {"name": "John", "age": 21},
  {"name": "Alice", "age": 20},
]

const charStream = Readable.from(chars);

charStream.on("data", (char) => {
  console.log(`${char.name}: ${char.age}`);
})
