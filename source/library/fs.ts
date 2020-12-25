import * as fs from "fs";

export const mkdirp = (path: string) => fs.mkdirSync(path, {recursive: true})

export const exists = fs.existsSync

export const clean = (path: string) => new Promise((resolve, reject) => fs.rmdir(path, {recursive: true}, e => e ? reject(e) : resolve(undefined)));
