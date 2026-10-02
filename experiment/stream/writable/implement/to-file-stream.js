import { Writable } from "node:stream"
import { promises as fs } from "node:fs"
import { dirname } from "node:path"
import { mkdirp } from "mkdirp"

export class ToFileStream extends Writable {
  constructor(options) {
    super({ ...options, objectMode: true })
  }

  _write(chunk, _encoding, cb) {
    mkdirp(dirname(chunk.path))
      .then(() => fs.writeFile(chunk.path, chunk.content))
      .then(() => cb())
      .catch(cb)
  }
}