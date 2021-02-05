import * as path from "path";
import {isOutsideOf, isTheSame} from "../library/path";
import {mkdirp, clean} from "../library/fs";

import Meta from "../Models/Meta";
import {Image as ImagePreset} from "../Models/Preset";

import * as Presets from "../Presets";

import Cutter, {ConvertError, InvalidPresetError} from "../Infrastructure/Converters/Cutter";

export {ConvertError, InvalidPresetError} from "../Infrastructure/Converters/Cutter";

import MetaData from "../Infrastructure/Converters/MetaData";

export class AccessError extends Error {
}

export class InputError extends Error {
}

const inputsDir = path.join('.', 'input');
const outputsDir = path.join('.', 'output');

export class Photos {

	async convert(presets: ImagePreset[], input: string, output: string, name: string, meta: any) {
		const currentInputPath = path.join(inputsDir, input);
		const currentOutputPath = path.join(outputsDir, output);

		Photos.validatePathOf(inputsDir, path.dirname(currentInputPath));
		Photos.validatePathOf(outputsDir, currentOutputPath, true);

		await clean(currentOutputPath);
		await mkdirp(currentOutputPath);

		return Cutter.convert(presets, currentInputPath, currentOutputPath, name)
			.catch(async (error) => {
				await clean(currentOutputPath);
				throw error;
			})
			.then(MetaData.insert(meta))
			.then((response: string[]) => response.map(i => path.relative(outputsDir, i)))
			.then((response: string[]) => response.map((filename) => ({filename})))
	}

	async convertWithAreaPresets(area: string[], presetsNames: string[], input: string, output: string, name: string, meta: Meta) {
		const presets = Presets.byArea(area);
		const presetsList = Array.isArray(presetsNames) && presetsNames.length ?
			presetsNames.map((presetName) => {
				const preset = presets.parameters[presetName];
				if (preset) {
					return preset;
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

	async convertMixed(area: string[], presets: string[] | ImagePreset, input: string, output: string, name: string, meta: Meta) {
		const areaPresets = Presets.byArea(area);
		if (Array.isArray(presets) && presets.length) {
			const presetsList =
				presets.map((presetConfig) => {
					if (typeof presetConfig === 'string') {
						const preset = areaPresets.parameters[presetConfig];
						if (preset) {
							return preset;
						} else {
							throw new InvalidPresetError(`Invalid preset name: ${presetConfig}`);
						}
					} else {
						return presetConfig;
					}
				})

			try {
				const currentOutputPath = path.join(outputsDir, output);
				Photos.validatePathOf(path.join('output', ...area), currentOutputPath, true);
			} catch (error) {
				throw new AccessError('Output path must be inside ' + path.join(...area));
			}

			return this.convert(presetsList, input, output, name, meta);
		} else {
			throw new Error();
		}
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
