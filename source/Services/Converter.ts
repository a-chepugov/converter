const {spawn} = require('child_process');
import * as path from 'path';
import {Input, Output, Operators, Convert} from 'imagemagick-cli-wrapper';

import * as Presets from '../Presets';
import {Image as ImagePreset} from '../Models/Preset';
import * as fromPreset from '../Presets/fromPreset';

import '../library/IM/ImageToIMOperations';

export class InvalidPresetError extends Error {
};

export class ConvertError extends Error {
};

const STATIC_PATH = './static/';
const INPUT_PATH = './input/';
const OUTPUT_PATH = './output/';

export class Converter {

	static buildConvertByPresets(input: string, output: string, presetsOutput: string, presets: ImagePreset[]) {
		const conversion = Convert
			.of(new Input.Globbing(input))
			.into(new Output.Filename(output))
			.with(new Operators.Strip())

		return presetsOutput && Array.isArray(presets) ?
			presets.reduce((conversion: Convert, preset: ImagePreset) => {
				const image = fromPreset.toImage(preset, STATIC_PATH);
				const params = image.toIMOperations(presetsOutput);
				return conversion.fork(params);
			}, conversion) :
			conversion
	}

	static convert(input: string, output: string, area: string[], presetsNames?: string[]) {
		const filenameInput = `${INPUT_PATH}${input}`;
		const filenameOutput = `${OUTPUT_PATH}${output}`;
		const format = path.extname(filenameInput);
		const presets = Presets.byArea(area);
		const presetsList = Array.isArray(presetsNames) && presetsNames.length ?
			presetsNames.map((name) => {
				const preset = presets.parameters[name];
				if (preset) {
					return preset
				} else {
					throw new InvalidPresetError(`Invalid preset name: ${name}`);
				}
			}) :
			Object.values(presets.parameters);

		const filenameOutputMain = `${filenameOutput}${format}`;
		const convertedFilesList = presetsList.map((preset) => fromPreset.toFilePath(OUTPUT_PATH, output, preset))

		const files = [filenameOutputMain, ...convertedFilesList];
		const convert = Converter.buildConvertByPresets(filenameInput, filenameOutputMain, filenameOutput, presetsList);

		const [command, ...parameters] = convert.build();

		const child = spawn(command, parameters);

		return new Promise((resolve, reject) => {
			let reason = ''
			child.stderr.on('data', (data: Buffer) => reason += data.toString('utf8'));
			child.on('close', (code: number) =>
				code ?
					reject(Object.assign(new ConvertError(`${JSON.stringify(arguments)}. ${reason}`), {code})) :
					resolve(files))
		});
	}

}

export default Converter
