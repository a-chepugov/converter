import {Logger} from "./index";

export {Logger} from "./index";

import * as fs from "fs";
import {normalize} from "path";

export class FileLogger implements Logger {
	private path: string;
	private factory: (level: string, path: string) => string;
	private currentFilename: string;
	private stream: fs.WriteStream;

	constructor(path: string) {
		this.path = path;
		this.filename((level: string, path: string) => {
			return `${path}/${(new Date()).toISOString().split('T')[0]}.${level}.log`;
		})
	}

	filename(factory: (level: string, path: string) => string) {
		this.factory = factory;
	}

	private _open(level: string) {
		const newFilename = normalize(this.factory(level, this.path));
		if (newFilename !== this.currentFilename) {
			this.stream = fs.createWriteStream(newFilename, {flags: 'as+'});
		}
		return this;
	}

	private _write(...messages: any[]) {
		this.stream.write(new Date().toISOString() + ': ' + messages.map(i => typeof i?.toString === 'function' ? i.toString() : '').join('') + '\n');
		return this;
	}

	info(...messages: any[]): any {
		return this._open('info')._write(...messages);
	};

	warn(...messages: any[]): any {
		return this._open('warn')._write(...messages);
	};

	error(...messages: any[]): any {
		return this._open('error')._write(...messages);
	};
}

export default FileLogger;
