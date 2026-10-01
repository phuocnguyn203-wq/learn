import { createServer } from "node:http";
import { createWriteStream } from "node:fs";
import { createGunzip } from "node:zlib";
import { basename, join } from "node:path";
import { createDecipheriv, randomBytes } from "node:crypto";

const secret = randomBytes(24);
console.log(`Generated secret: ${secret.toString("hex")}`);

const server = createServer((req, res) => {
  // using basename to only takes the last one
  // if not path can be "../../../../usr/bin/node", that would be catastrophic
  const filename = basename(req.headers["x-filename"]);
  const iv = Buffer.from(req.headers["x-initialization-vector"], "hex");
  const destFilename = join(import.meta.dirname, "received-files", filename);
  console.log(`File request received: ${filename}`);
  req
    .pipe(createDecipheriv("aes192", secret, iv))
    .pipe(createGunzip())
    .pipe(createWriteStream(destFilename))
    .on("finish", () => {
      res.writeHead(201, { "content-type": "text/plain" });
      res.end("OK\n");
      console.log(`File saved ${destFilename}`)
    })
})

server.listen(3000, () => console.log("Listening on port 3000"));