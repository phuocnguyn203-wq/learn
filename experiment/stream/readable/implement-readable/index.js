import { RandomStream } from "./random-stream.js";

const rs = new RandomStream();
rs
  .on("readable", () => {
    let chunk;
    while((chunk=rs.read()) != null) {
      console.log(`${chunk.toString()}`);
    }
  })
  .on("end", () => console.log("Here's you randoms string"));