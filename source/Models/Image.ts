import ImageWatermark from './ImageWatermark';
import {normalize, join} from 'path';

export type Size = [number, number];
export type Unsharp = [number, number, number, number];

export class Image {
	protected readonly path: string;
	protected readonly name: string;
	protected readonly extension: string;
	size: Size;
	quality: number;
	method: 'trim' | 'scale';
	unsharp: Unsharp;
	interlace: string;
	watermarks: ImageWatermark[];

	constructor(path: string, name: string) {
		this.path = path;
		this.name = name;
	}

	set<K extends keyof this>(name: K, value: this[K]) {
		Object.defineProperty(this, name, {value});
		return this;
	}

	get fullname() {
		return normalize(join(this.path, this.name));
	}
}

export default Image;
