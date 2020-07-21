import {toJSON} from "../../library/Server/library/Stream";
import {Context} from "../../library/Server";
import {Profiler} from "../../library/Profiler";

import Meta from "../../Models/Meta";

import Photos, {AccessError, ConvertError, InvalidPresetError} from "../../Services/Photos";

const ProfilerDate = Profiler.factory();
const profilerConvert = ProfilerDate.of('Photos.convert')

const photos = new Photos();

export function convert(ctx: Context, body: { [key: string]: any }) {
	const profiler = profilerConvert.start();
	const {input, output, format, area, presets, meta} = body;
	return photos
		.convert(input, output, area, presets, meta as Meta)
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
