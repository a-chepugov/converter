import * as path from "path";
import {isOutsideOf} from "../library/path";
import {mkdirp} from "../library/fs";

import Meta from "../Models/Meta";

import Converter from "./Converter";

export {ConvertError, InvalidPresetError} from "./Converter";

export class AccessError extends Error {
};

export class Photos {
	convert = async (input: string, output: string, area: string[], presets: string[], meta: Meta) => {
		const cwd = process.cwd();
		const inputsDir = path.normalize(path.join(cwd, 'input'));
		const outputsDir = path.normalize(path.join(cwd, 'output'));
		const currentInputPath = path.normalize(path.join(inputsDir, input));
		const currentOutputPath = path.normalize(path.join(outputsDir, output));
		const currentOutputPathBase = path.dirname(currentOutputPath)

		if (isOutsideOf(inputsDir, path.dirname(currentInputPath))) {
			throw new AccessError('Access restricted to: ' + input);
		}

		if (isOutsideOf(outputsDir, path.dirname(currentOutputPath))) {
			throw new AccessError('Access restricted to: ' + output);
		}

		mkdirp(currentOutputPathBase);
		// @todo передавать format и meta, а также нормализированные параметры путей
		return Converter.convert(input, output, area, presets);
	}
}

export default Photos;
