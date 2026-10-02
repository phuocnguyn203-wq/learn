import { join } from "node:path"
import { ToFileStream } from "./to-file-stream.js"

const tfs = new ToFileStream();
const outDir = join(import.meta.dirname, "files")
tfs.write({ path: join(outDir, "file1.txt"), content: "hello" })
tfs.write({ path: join(outDir, "file2.txt"), content: "Nodejs" })
tfs.write({ path: join(outDir, "file3.txt"), content: "streams" })
tfs.end(() => console.log("All file created"));