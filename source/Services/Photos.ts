import * as path from "path";
import {isOutsideOf, isTheSame} from "../library/path";
import {exists, mkdirp} from "../library/fs";

import Meta from "../Models/Meta";
import {Image as ImagePreset} from "../Models/Preset";

import * as Presets from "../Presets";

import Cutter, {ConvertError, InvalidPresetError} from "../Infrastructure/Converters/Cutter";
export {ConvertError, InvalidPresetError} from "../Infrastructure/Converters/Cutter";

import MetaData from "../Infrastructure/Converters/MetaData";

export class AccessError extends Error {
}

const inputsDir = path.join('.', 'input');
const outputsDir = path.join('.', 'output');

export class Photos {

	async convert(presets: ImagePreset[], input: string, output: string, name: string, meta: any) {
		const currentInputPath = path.join(inputsDir, input);
		const currentOutputPath = path.join(outputsDir, output);

		Photos.validatePathOf(inputsDir, path.dirname(currentInputPath));
		Photos.validatePathOf(outputsDir, currentOutputPath, true);

		if (!exists(currentOutputPath)) {
			mkdirp(currentOutputPath);
		}

		return Cutter.convert(presets, currentInputPath, currentOutputPath, name)
			.then(MetaData.insert(meta))
			.then((response: string[]) => response.map(i => path.relative(outputsDir, i)))
	}

	async convertWithAreaPresets(area: string[], presetsNames: string[], input: string, output: string, name: string, meta: Meta) {
		const presets = Presets.byArea(area);
		const presetsList = Array.isArray(presetsNames) && presetsNames.length ?
			presetsNames.map((presetName) => {
				const preset = presets.parameters[presetName];
				if (preset) {
					return Object.create(preset, {name: {value: name}})
				} else {
					throw new InvalidPresetError(`Invalid preset name: ${presetName}`);
				}
			}) :
			Object.values(presets.parameters);

		try {
			const currentOutputPath = path.join(outputsDir, output);
			Photos.validatePathOf(path.join('output', ...area), currentOutputPath, true);
		} catch (error) {
				throw new AccessError('Output path must be inside ' + path.join(...area));
		}

		return this.convert(presetsList, input, output, name, meta);
	}

	static validatePathOf(containerPath: string, targetPath: string, strict = false) {
		if (isOutsideOf(containerPath, targetPath)) {
			throw new AccessError('Access restricted to: ' + targetPath);
		}

		if (strict && isTheSame(containerPath, targetPath)) {
			throw new AccessError('Path must be inside work directory, not the same directory');
		}
	}
}

export default Photos;
