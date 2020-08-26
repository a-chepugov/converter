import {Context} from "../../library/Server";
import {Profiler} from "../../library/Profiler";

import Photos, {AccessError, ConvertError, InvalidPresetError} from "../../Services/Photos";

const ProfilerDate = Profiler.factory();
const profilerConvert = ProfilerDate.of('Photos')

const photos = new Photos();

export function convertByPreset(ctx: Context, body: { [key: string]: any }) {
	const profiler = profilerConvert.start(':convertByPreset');
	const {input, output, name, area, presets, meta} = body;
	return photos
		.convertWithAreaPresets(area, presets, input, output, name, meta)
		.then((response: any) => {
			ctx.response.setHeader('X-COMPLETED-IN', profiler.end().result);
			return response;
		})
		.catch((error) => {
			if (error instanceof AccessError) {
				error.reason = error.message;
				error.code = 403;
			}
			if (error instanceof InvalidPresetError) {
				error.reason = error.message;
				error.code = 422;
			}
			if (error instanceof ConvertError) {
				error.reason = 'Conversion error. Code: ' + error.code;
				error.code = 500;
			}
			throw error;
		});
}

export function convert(ctx: Context, body: { [key: string]: any }) {
	const profiler = profilerConvert.start('convert');
	const {input, output, name, presets, meta} = body;
	return photos.convert(presets, input, output, name, meta)
		.then((response: any) => {
			ctx.response.setHeader('X-COMPLETED-IN', profiler.end().result);
			return response;
		})
		.catch((error) => {
			if (error instanceof AccessError) {
				error.reason = error.message;
				error.code = 403;
			}
			if (error instanceof InvalidPresetError) {
				error.reason = error.message;
				error.code = 422;
			}
			if (error instanceof ConvertError) {
				error.reason = 'Conversion error. Code: ' + error.code;
				error.code = 500;
			}
			throw error;
		});
}

