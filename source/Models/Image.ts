import ImageWatermark from './ImageWatermark';

export type Size = [number, number];
export type Unsharp = [number, number, number, number];

export class Image {
	size: Size;
	method: 'trim' | 'scale';
	quality: number;
	format: 'jpg' | 'webp';
	suffix: string;
	unsharp: Unsharp;
	interlace: string;
	watermarks: ImageWatermark[];

	set<K extends keyof this>(name: K, value: this[K]) {
		this[name] = value;
		return this;
	}
}

export default Image;
