import Image from '../Models/Image';
import ImageWatermark from '../Models/ImageWatermark';
import {Image as ImagePreset, Watermark as WatermarkPreset} from '../Models/Preset';
import {join} from "path";

export function toWatermark(preset: WatermarkPreset, staticpath: string): ImageWatermark {
	return (new ImageWatermark())
		.set('text', {font: join(staticpath, preset.font), size: preset.size, color: preset.color, text: preset.text})
		.set('offset', {x: preset.x, y: preset.y})
		.set('align', preset.align)
		.set('valign', preset.valign)
}

export function toImage(output: string, name: string, preset: ImagePreset, staticpath: string): Image {
	const image = new Image(
		output,
		(name || '') + (preset.name || '') + (preset.suffix || '') + (preset.extension ? '.' + preset.extension : '')
	)

	if (preset.width && preset.height) {
		image.set('size', [preset.width, preset.height])
	}

	if (preset.method) {
		image.set('method', preset.method)
	}

	if (preset.quality) {
		image.set('quality', preset.quality)
	}

	if (preset.interlace) {
		image.set('interlace', preset.interlace)
	}

	if (preset.unsharp) {
		image.set('unsharp', preset.unsharp)
	}

	if (Array.isArray(preset.watermarks)) {
		const watermarks = preset.watermarks.map((preset: WatermarkPreset) => toWatermark(preset, staticpath));
		image.set('watermarks', watermarks);
	}
	return image
}

