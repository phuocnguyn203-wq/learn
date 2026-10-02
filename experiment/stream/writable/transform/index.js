import { ReplaceStream } from "./replace-stream.js";

const rs = new ReplaceStream("World", "Nodejs");
rs.on("data", chunk => process.stdout.write(chunk.toString()))
rs.write("Hello W")
rs.write("orld")
rs.end("\n")
