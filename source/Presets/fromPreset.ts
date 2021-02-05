import Image from '../Models/Image';
import {ImageWatermark, ImageWatermarkText, ImageWatermarkImage} from '../Models/ImageWatermark';
import {
	Image as ImagePreset,
	Watermark as WatermarkPreset,
	WatermarkText as WatermarkTextPreset,
	WatermarkImage as WatermarkImagePreset
} from '../Models/Preset';
import {join} from "path";

export function toWatermark(unknownPreset: WatermarkPreset, staticpath: string): ImageWatermark {
	/** @ts-ignore */
	if (unknownPreset._type === 'text' || !unknownPreset._type) {
		const preset = unknownPreset as unknown as WatermarkTextPreset;
		return (new ImageWatermarkText())
			.set('text', {font: join(staticpath, preset.font), size: preset.size, color: preset.color, text: preset.text})
			.set('offset', {x: preset.x, y: preset.y})
			.set('rotate', preset.rotate)
			.set('align', preset.align)
			.set('valign', preset.valign)
		/** @ts-ignore */
	} else if (unknownPreset._type === 'image') {
		const preset = unknownPreset as unknown as WatermarkImagePreset;
		return (new ImageWatermarkImage())
			.set('source', preset.source)
			.set('size', preset.size)
			.set('offset', {x: preset.x, y: preset.y})
			.set('rotate', preset.rotate)
			.set('align', preset.align)
			.set('valign', preset.valign)
	}
}

export function toImage(output: string, name: string, preset: ImagePreset, staticpath: string): Image {
	const image = new Image(
		output,
		(name || '') + (preset.suffix || '') + (preset.extension ? '.' + preset.extension : '')
	)

	if (preset.width && preset.height) {
		image.set('size', [preset.width, preset.height])
	}

	if (preset.method) {
		image.set('method', preset.method)
	}

	if (preset.rotate) {
		image.set('rotate', preset.rotate)
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
		const watermarks = preset.watermarks.map((preset: WatermarkTextPreset) => toWatermark(preset, staticpath));
		image.set('watermarks', watermarks);
	}
	return image
}

