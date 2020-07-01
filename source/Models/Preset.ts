export interface Area {
	parameters: { [key: string]: Image }
}

export interface Image {
	format: 'jpg' | 'webp',
	unsharp?: [number, number, number, number],
	width: number,
	height: number,
	method: 'trim' | 'scale',
	quality?: number,
	suffix?: string,
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
