import * as fs from "fs";

export const mkdirp = (path: string) => fs.mkdirSync(path, {recursive: true})

export const exists = fs.existsSync
