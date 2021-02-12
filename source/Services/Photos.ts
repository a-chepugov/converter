import * as path from "path";
import {isOutsideOf, isTheSame} from "../library/path";
import {mkdirp, clean} from "../library/fs";

import Image from "../Models/Image";
import {Image as ImagePreset, Meta as MetaPreset} from "../Models/Preset";

import * as Presets from "../Presets";

import Cutter, {ConvertError, InvalidPresetError} from "../Infrastructure/Converters/Cutter";

export {ConvertError, InvalidPresetError} from "../Infrastructure/Converters/Cutter";

import MetaData from "../Infrastructure/Converters/MetaData";

export class AccessError extends Error {
}

export class InputError extends Error {
}

interface ImagePresetExtendable extends ImagePreset {
	_extends?: string
	_inherits_meta?: boolean
}

const inputsDir = path.join('.', 'input');
const outputsDir = path.join('.', 'output');

export class Photos {

	async convert(presets: ImagePreset[], input: string, output: string, name: string) {
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
			.then((images: Array<Image>) => MetaData.insert(images.filter((image) => image.meta)).then(() => images, () => images))
			.then((images: Image[]) => images.map((image) => ({filename: path.relative(outputsDir, image.fullname)})))
	}

	async convertExtendable(area: string[], presets: ImagePresetExtendable[], input: string, output: string, name: string, meta: MetaPreset) {
		const presetsDictionary = Presets.byArea(area);

		function buildPresetFromExtendable(presetExtendable: ImagePresetExtendable, presetsDictionary: { [key: string]: ImagePreset }) {
			const preset = presetsDictionary[presetExtendable._extends];
			if (preset) {
				let watermarks = Array.isArray(preset.watermarks) ? preset.watermarks : [];
				if (Array.isArray(presetExtendable.watermarks) && presetExtendable.watermarks.length) {
					watermarks = watermarks.concat(presetExtendable.watermarks);
				}
				return {...preset, ...presetExtendable, watermarks};
			} else {
				throw new InvalidPresetError(`Invalid preset name: ${presetExtendable._extends}`);
			}
		}

		function extendPreset(presetExtendable: ImagePresetExtendable): ImagePreset {
			const preset = typeof presetExtendable._extends === 'string' ?
				buildPresetFromExtendable(presetExtendable, presetsDictionary.parameters) :
				presetExtendable;

			preset.meta = (presetExtendable._inherits_meta === false) ?
				preset.meta :
				preset.meta ? {...meta, ...preset.meta} : meta;

			return preset;
		}

		if (Array.isArray(presets) && presets.length) {
			const presetsList = presets.map((presetExtends: ImagePresetExtendable) => extendPreset(presetExtends));
			try {
				const currentOutputPath = path.join(outputsDir, output);
				Photos.validatePathOf(path.join('output', ...area), currentOutputPath, true);
			} catch (error) {
				throw new AccessError('Output path must be inside ' + path.join(...area));
			}

			return this.convert(presetsList, input, output, name);
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
