import * as  fs from "fs";

export function mkdirp(path: string) {
	if (!fs.existsSync(path)) {
		return fs.mkdirSync(path, {recursive: true});
	}
}
