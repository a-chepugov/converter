const {spawn} = require('../../library/Process');
const path = require('path');
import {Input, Output, Operators, Convert, SequenceOperators} from 'imagemagick-cli-wrapper';

import Image from '../../Models/Image';
import {Image as ImagePreset} from '../../Models/Preset';
import * as fromPreset from '../../Presets/fromPreset';

import '../../library/IM/ImageToIMOperations';

export class InvalidPresetError extends Error {
}

export class ConvertError extends Error {
}

const STATIC_PATH = 'static';

export class Cutter {

	static buildConvertFromImages(inputImage: Image, outputImages: Image[]) {
		if ((Array.isArray(outputImages) && outputImages.length)) {
			const [image, ...rest] = outputImages;
			const firstImageOperations = image.toIMOperations();

			const convert = Convert
				.of(new Input.Globbing(inputImage.fullname))
				.into(new Output.Filename(image.fullname))
				.with(new Operators.Strip())
			;

			return rest
				.reduce((convert: Convert, image: Image) => {
					const operations = image.toIMOperations()
					operations.push(new SequenceOperators.Write(image.fullname));
					return convert.fork(operations);
				}, convert)
				.append(firstImageOperations);
		} else {
			throw new InvalidPresetError('Invalid conversions list');
		}
	}

	static convert(presetsList: ImagePreset[], input: string, output: string, name: string) {
		const inputImage = new Image(path.dirname(input), path.basename(input));
		if (Array.isArray(presetsList) && presetsList.length) {
			const outputImages = presetsList.map((preset) => fromPreset.toImage(output, name, preset, STATIC_PATH))

			const convert = Cutter.buildConvertFromImages(inputImage, outputImages);

			return spawn.apply(null, convert.build())
				.then(() => outputImages.map((i) => i.fullname))
				.catch((error: any) => {
					const e = new ConvertError(`${JSON.stringify(arguments)}. ${error.message}`);
					e.code = error.code;
					throw e;
				})
		} else {
			throw new InvalidPresetError('Invalid conversions list');
		}
	}

}

export default Cutter;
