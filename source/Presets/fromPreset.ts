import Image from '../Models/Image';
import ImageWatermark from '../Models/ImageWatermark';
import {Image as ImagePreset, Watermark as WatermarkPreset} from '../Models/Preset';
import * as path from "path";

export function toWatermark(preset: WatermarkPreset, staticpath: string): ImageWatermark {
	return (new ImageWatermark())
		.set('text', {font: staticpath + preset.font, size: preset.size, color: preset.color, text: preset.text})
		.set('offset', {x: preset.x, y: preset.y})
		.set('align', preset.align)
		.set('valign', preset.valign)
}

export function toImage(preset: ImagePreset, staticpath: string): Image {

	const image = (new Image())
		.set('size', [preset.width, preset.height])
		.set('method', preset.method)
		.set('quality', preset.quality)
		.set('format', preset.format)
		.set('suffix', preset.suffix)
		.set('unsharp', preset.unsharp)

	if (preset.interlace) {
		image.set('interlace', preset.interlace)
	}

	if (Array.isArray(preset.watermarks)) {
		const watermarks = preset.watermarks.map((preset: WatermarkPreset) => toWatermark(preset, staticpath));
		image.set('watermarks', watermarks);
	}
	return image
}

export function toFilePath(otputpath: string, name: string, preset: ImagePreset): string {
	return path.normalize(path.join(otputpath, name + preset.suffix + '.' + preset.format));
	return path.normalize(path.join(otputpath, name + preset.suffix + '.' + preset.format));
}
