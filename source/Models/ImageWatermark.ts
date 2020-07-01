export type Offset = { degreesX?: number, degreesY?: number, x?: number, y?: number };
export type Text = { font: string; size: number; color: string; text: string };

export class ImageWatermark {
	text: Text;
	offset: Offset;
	align: 'left' | 'center' | 'right';
	valign: 'top' | 'center' | 'bottom';

	set<K extends keyof this>(name: K, value: this[K]) {
		this[name] = value;
		return this;
	}
}

export default ImageWatermark;
