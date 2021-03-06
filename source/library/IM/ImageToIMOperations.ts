import {Operators, Settings, Option} from 'imagemagick-cli-wrapper';
import Image from '../../Models/Image';
import ImageWatermark from '../../Models/ImageWatermark';
import './ImageWatermarkToIMOperations';

import convertStringToInterlaceType from './helpers/convertStringToInterlaceType';
import convertParamsToResizeOperations from './helpers/convertParamsToResizeOperations';

declare module "../../Models/Image" {
	interface Image {
		toIMOperations(): Option[];
	}
}

Image.prototype.toIMOperations = function (): Option[] {
	let operations: Option[] = [];

	if (this.size && (this.size[0] !== undefined || this.size[1] !== undefined)) {
		operations.splice(0, 0, ...convertParamsToResizeOperations(this.size[0], this.size[1], this.method));
	}

	if (this.rotate) {
		operations.push(new Operators.Rotate(this.rotate));
	}

	if (this.quality) {
		operations.push(new Settings.Quality(this.quality));
	}

	if (this.unsharp) {
		operations.push(new Operators.Unsharp(this.unsharp[0], this.unsharp[1], this.unsharp[2], this.unsharp[3]));
	}

	if (this.interlace) {
		operations.push(new Settings.Interlace(convertStringToInterlaceType(this.interlace)));
	}

	if (Array.isArray(this.watermarks) && this.watermarks.length) {
		operations = this.watermarks
			.map((watermark: ImageWatermark) => watermark.toIMOperations())
			.reduce((operations: Option[], watermarkOperations: Option[]) => {
				return operations.concat(watermarkOperations);
			}, operations)
	}

	operations.push(new Settings.Colorspace(Settings.ColorspaceType.RGB));

	return operations;
};
