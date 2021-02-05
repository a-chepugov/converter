export type Offset = { x?: number, y?: number };
export type Text = { font: string; size: number; color: string; text: string };

import {Align, Valign} from "../Models/Preset"

export abstract class ImageWatermark {
	align?: Align;
	valign?: Valign;
	offset?: Offset;
	rotate?: number;

	set<K extends keyof this>(name: K, value: this[K]) {
		this[name] = value;
		return this;
	}
}

export default ImageWatermark;

export class ImageWatermarkText extends ImageWatermark {
	text: Text;
}

export class ImageWatermarkImage extends ImageWatermark {
	source: string;
	size?: number;
}

