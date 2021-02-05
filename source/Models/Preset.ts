export interface Area {
	parameters: { [key: string]: Image }
}

export type ResizeMethod = 'trim' | 'scale' | 'shrink';
export type Align = 'left' | 'center' | 'right';
export type Valign = 'top' | 'center' | 'bottom';

export type Watermark = WatermarkText | WatermarkImage;

export interface Image {
	suffix?: string,
	extension: string,
	width: number,
	height: number,
	method: ResizeMethod,
	rotate?: number,
	quality?: number,
	unsharp?: [number, number, number, number],
	interlace?: string,
	watermarks?: Watermark[]
}

interface WatermarkBase {
	align: Align,
	valign: Valign,
	x: number,
	y: number,
	rotate?: number,
}

export interface WatermarkText extends WatermarkBase {
	size?: number,
	color: string,
	font: string
	text: string,
}

export interface WatermarkImage extends WatermarkBase {
	size?: number,
	source: string,
}
