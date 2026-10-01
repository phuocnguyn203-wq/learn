import { createServer } from "node:http";
import Chance from "chance";

const chance = new Chance();
const server = createServer((req, res) => {
  res.writeHead(200, { "Content-type": "text/plain"});
  do {
    res.write(`${chance.string()}`);
  } while (chance.bool({ likelihood: 95 }));
  res.end("\n\n");
  res.on("finish", () => console.log("All data sent"));
})

server.listen(3000, () => console.log("Server is listening on port 3000"));