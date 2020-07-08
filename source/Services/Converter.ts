const {spawn} = require('child_process');
import {Input, Output, Convert} from 'imagemagick-cli-wrapper';

import * as Presets from '../Presets';
import {Image as ImagePreset} from '../Models/Preset';
import * as fromPreset from '../Presets/fromPreset';

import '../library/IM/ImageToIMOperations';

export class ConvertError extends Error {
};

export class Converter {

	static buildConvertByPresets(input: string, output: string, presetsOutput: string, presets: ImagePreset[]) {
		const conversion = Convert
			.of(new Input.Globbing(input))
			.into(new Output.Filename(output))

		return presetsOutput && Array.isArray(presets) ?
			presets.reduce((conversion: Convert, preset: ImagePreset) => {
				const image = fromPreset.toImage(preset, './static/');
				const params = image.toIMOperations(presetsOutput);
				return conversion.fork(params);
			}, conversion) :
			conversion
	}

	static convert(input: string, output: string, area: string[], presetsNames?: string[]) {
		const filenameInput = `./input/${input}`;
		const filenameOutput = `./output/${output}`;

		const presets = Presets.byArea(area);
		const presetsList = Array.isArray(presetsNames) && presetsNames.length ?
			presetsNames.map((name) => presets.parameters[name]).filter(item => item) :
			Object.values(presets.parameters);

		const convert = Converter.buildConvertByPresets(filenameInput, `${filenameOutput}.jpg`, filenameOutput, presetsList);

		const [command, ...parameters] = convert.build();

		const child = spawn(command, parameters);

		return new Promise((resolve, reject) => {
			let reason = ''
			child.stderr.on('data', (data: Buffer) => reason += data.toString('utf8'));
			child.on('close', (code: number) =>
				code ?
					reject(Object.assign(new ConvertError(`${JSON.stringify(arguments)}. ${reason}`), {code})) :
					resolve(code))
		});
	}

}

export default Converter
