export interface Area {
	parameters: { [key: string]: Image }
}

export type RESIZE_METHOD = 'trim' | 'scale' | 'shrink';

export interface Image {
	suffix?: string,
	extension: string,
	width: number,
	height: number,
	method: RESIZE_METHOD,
	quality?: number,
	unsharp?: [number, number, number, number],
	interlace?: string,
	watermarks?: Watermark[]
}

export interface Watermark {
	align: 'left' | 'center' | 'right',
	valign: 'top' | 'center' | 'bottom',
	x: number,
	y: number,
	size: number,
	color: string,
	font: string
	text: string,
}
