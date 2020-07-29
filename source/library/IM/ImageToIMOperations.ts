import {Operators, Settings, Options} from 'imagemagick-cli-wrapper';

import Image from '../../Models/Image';
import ImageWatermark from '../../Models/ImageWatermark';
type Option = Options.Option;
import './ImageWatermarkToIMOperations';

import convertStringToInterlaceType from './helpers/convertStringToInterlaceType';
import convertParamsToGeometry from './helpers/convertParamsToGeometry';

declare module "../../Models/Image" {
	interface Image {
		toIMOperations(): Option[];
	}
}

Image.prototype.toIMOperations = function (): Option[] {
	let operations = [];

	operations.push(new Operators.Resize(convertParamsToGeometry(this.method, this.size[0], this.size[1])));
	if (this.quality) {
		operations.push(new Settings.Quality(this.quality));
	}

	if (this.unsharp) {
		operations.push(new Operators.Unsharp(this.unsharp[0], this.unsharp[1], this.unsharp[2], this.unsharp[3]));
	}

	if (this.interlace) {
		if (convertStringToInterlaceType(this.interlace)) {
			operations.push(new Settings.Interlace(this.interlace));
		}
	}


	if (Array.isArray(this.watermarks) && this.watermarks.length) {
		operations = this.watermarks
			.map((watermark: ImageWatermark) => watermark.toIMOperations())
			.reduce((operations: Option[], watermarkOperations: Option[]) => {
				return operations.concat(watermarkOperations);
			}, operations)
	}

	return operations;
};
