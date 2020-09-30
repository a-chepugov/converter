import {Image} from '../../Models/Preset';

const presets: { [key: string]: Image } = {
	original: {
		extension: 'jpeg',
		width: 1600,
		height: 1200,
		method: 'scale',
	},
	fx_jpg: {
		extension: 'jpg',
		quality: 70,
		unsharp: [0.6, 0.6, +1, +0.05],
		width: 800,
		height: 600,
		suffix: 'fx',
		method: 'scale',
		interlace: 'partition',
		watermarks: [{
			align: 'right',
			valign: 'top',
			x: 44,
			y: -33,
			size: 150,
			color: '#ffffffB0',
			text: 'i',
			font: 'dixiland_mio.ttf'
		}]
	},
	fx_webp: {
		quality: 70,
		extension: 'webp',
		unsharp: [0.6, 0.6, +1, +0.05],
		width: 800,
		height: 600,
		suffix: 'fx',
		method: 'scale',
		interlace: 'plane',
		watermarks: [{
			align: 'right',
			valign: 'top',
			x: 44,
			y: -33,
			size: 150,
			color: '#ffffffB0',
			text: 'i',
			font: 'dixiland_mio.ttf'
		}]
	},
	f_jpg: {
		quality: 70,
		extension: 'jpg',
		unsharp: [0.6, 0.6, +1, +0.05],
		width: 640,
		height: 480,
		suffix: 'f',
		method: 'trim',
		interlace: 'partition',
		watermarks: [{
			align: 'right',
			valign: 'top',
			x: 43,
			y: -34,
			size: 150,
			color: '#ffffffB0',
			text: 'i',
			font: 'dixiland_mio.ttf'
		}]
	},
	f_webp: {
		quality: 70,
		extension: 'webp',
		unsharp: [0.6, 0.6, +1, +0.05],
		width: 640,
		height: 480,
		suffix: 'f',
		method: 'trim',
		interlace: 'plane',
		watermarks: [{
			align: 'right',
			valign: 'top',
			x: 43,
			y: -34,
			size: 150,
			color: '#ffffffB0',
			text: 'i',
			font: 'dixiland_mio.ttf'
		}]
	},
	bx_jpg: {
		quality: 70,
		extension: 'jpg',
		unsharp: [0.6, 0.6, +1, +0.05],
		width: 380,
		height: 250,
		suffix: 'bx',
		method: 'trim',
		watermarks: [{
			align: 'right',
			valign: 'top',
			x: 30,
			y: -24,
			size: 110,
			color: '#ffffffB0',
			text: 'i',
			font: 'dixiland_mio.ttf'
		}]
	},
	bx_webp: {
		quality: 70,
		extension: 'webp',
		unsharp: [0.6, 0.6, +1, +0.05],
		width: 380,
		height: 250,
		suffix: 'bx',
		method: 'trim',
		watermarks: [{
			align: 'right',
			valign: 'top',
			x: 30,
			y: -24,
			size: 110,
			color: '#ffffffB0',
			text: 'i',
			font: 'dixiland_mio.ttf'
		}]
	},
	b_jpg: {
		quality: 70,
		extension: 'jpg',
		unsharp: [0.6, 0.6, +1, +0.05],
		width: 300,
		height: 200,
		suffix: 'b',
		method: 'trim',
		watermarks: [{
			align: 'right',
			valign: 'top',
			x: 23,
			y: -17,
			size: 80,
			color: '#ffffffB0',
			text: 'i',
			font: 'dixiland_mio.ttf'
		}]
	},
	b_webp: {
		quality: 70,
		extension: 'webp',
		unsharp: [0.6, 0.6, +1, +0.05],
		width: 300,
		height: 200,
		suffix: 'b',
		method: 'trim',
		watermarks: [{
			align: 'right',
			valign: 'top',
			x: 23,
			y: -17,
			size: 80,
			color: '#ffffffB0',
			text: 'i',
			font: 'dixiland_mio.ttf'
		}]
	},
	bl_jpg: {
		quality: 70,
		extension: 'jpg',
		unsharp: [0.6, 0.6, +1, +0.05],
		width: 295,
		height: 195,
		suffix: 'bl',
		method: 'trim',
		watermarks: [{
			align: 'right',
			valign: 'top',
			x: 23,
			y: -17,
			size: 80,
			color: '#ffffffB0',
			text: 'i',
			font: 'dixiland_mio.ttf',
		}]
	},
	bl_webp: {
		quality: 70,
		extension: 'webp',
		unsharp: [0.6, 0.6, +1, +0.05],
		width: 295,
		height: 195,
		suffix: 'bl',
		method: 'trim',
		watermarks: [{
			align: 'right',
			valign: 'top',
			x: 23,
			y: -17,
			size: 80,
			color: '#ffffffB0',
			text: 'i',
			font: 'dixiland_mio.ttf'
		}]
	},
	s_jpg: {
		quality: 80,
		extension: 'jpg',
		unsharp: [0.4, 0.4, +1, +0.05],
		width: 100,
		height: 67,
		suffix: 's',
		method: 'trim'
	},
	s_webp: {
		quality: 80,
		extension: 'webp',
		unsharp: [0.4, 0.4, +1, +0.05],
		width: 100,
		height: 67,
		suffix: 's',
		method: 'trim'
	},
	lx_jpg: {
		quality: 80,
		extension: 'jpg',
		unsharp: [0.4, 0.4, +1, +0.05],
		width: 85,
		height: 56,
		suffix: 'lx',
		method: 'trim'
	},
	lx_webp: {
		quality: 80,
		extension: 'webp',
		unsharp: [0.4, 0.4, +1, +0.05],
		width: 85,
		height: 56,
		suffix: 'lx',
		method: 'trim'
	},
	sx_jpg: {
		quality: 80,
		extension: 'jpg',
		unsharp: [0.4, 0.4, +1, +0.05],
		width: 135,
		height: 90,
		suffix: 'sx',
		method: 'trim'
	},
	sx_webp: {
		quality: 80,
		extension: 'webp',
		unsharp: [0.4, 0.4, +1, +0.05],
		width: 135,
		height: 90,
		suffix: 'sx',
		method: 'trim'
	},
	m_jpg: {
		quality: 80,
		extension: 'jpg',
		unsharp: [0.4, 0.4, +1, +0.05],
		width: 185,
		height: 120,
		suffix: 'm',
		method: 'trim'
	},
	m_webp: {
		quality: 80,
		extension: 'webp',
		unsharp: [0.4, 0.4, +1, +0.05],
		width: 185,
		height: 120,
		suffix: 'm',
		method: 'trim'
	},
	z74x56x70_webp: {
		quality: 70,
		extension: 'webp',
		unsharp: [0.4, 0.4, +1, +0.05],
		width: 74,
		height: 56,
		suffix: 'z74x56x70',
		method: 'trim'
	},
}

export default presets;
