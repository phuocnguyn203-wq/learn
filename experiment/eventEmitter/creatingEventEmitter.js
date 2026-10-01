import { EventEmitter } from "node:events";
import { readFile } from "node:fs";

function findRegex(files, regex) {
    const emitter = new EventEmitter();
    for (const file of files) {
        readFile(file, "utf8", (err, content) => {
            if (err) {
                return emitter.emit("error", err);
            }
            emitter.emit("fileread", file);
            const match = content.match(regex);
            if (match) {
                for (const elem of match) {
                    emitter.emit("found", file, elem);
                }
            } 
        })
    }
    return emitter;
}

findRegex(
    ["./fileA.txt"],
    /hello [\W]+/g
)
    .on("fileread", file => console.log(`File ${file} is read `))
    .on("found", (_file, match) => console.log(`Matched ${match}`))
    .on("error", err => console.log(err));