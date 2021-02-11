import ImageWatermark from './ImageWatermark';
import {normalize, join} from 'path';

import {ResizeMethod} from "../Models/Preset"

export type Size = [number, number];
export type Unsharp = [number, number, number, number];

export class Image {
	protected readonly path: string;
	protected readonly name: string;
	protected readonly extension: string;
	size: Size;
	method: ResizeMethod;
	quality?: number;
	rotate?: number;
	unsharp?: Unsharp;
	interlace?: string;
	watermarks?: ImageWatermark[];

	constructor(path: string, name: string) {
		this.path = path;
		this.name = name;
	}

	set<K extends keyof this>(name: K, value: this[K]) {
		this[name] = value;
		return this;
	}

	get fullname() {
		return normalize(join(this.path, this.name));
	}
}

export default Image;
