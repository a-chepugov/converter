const {spawn} = require('child_process');
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
			throw new InvalidPresetError('invalid conversions list');
		}
	}

	static convert(presetsList: ImagePreset[], input: string, output: string) {
		const inputImage = new Image(path.dirname(input), path.basename(input));

		const outputImages = presetsList.map((preset) => fromPreset.toImage(output, preset, STATIC_PATH))

		const convert = Cutter.buildConvertFromImages(inputImage, outputImages);

		return new Promise((resolve, reject) => {
			try {
				const [command, ...parameters] = convert.build();
				const child = spawn(command, parameters);

				let reason = '';
				child.stderr.on('data', (data: Buffer) => reason += data.toString('utf8'));
				child.on('close', (code: number) =>
					code ?
						reject(Object.assign(new ConvertError(`${JSON.stringify(arguments)}. ${reason}`), {code})) :
						resolve(outputImages.map((i) => i.fullname))
				)
			} catch (error) {
				reject(error);
			}
		});
	}

}

export default Cutter
