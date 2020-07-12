import {toJSON} from "../../library/Server/library/Stream";
import {Context} from "../../library/Server";
import {Profiler} from "../../library/Profiler";

import Meta from "../../Models/Meta";

import Photos, {AccessError, ConvertError} from "../../Services/Photos";

const ProfilerDate = Profiler.factory();
const profilerConvert = ProfilerDate.of('Photos.convert')

const photos = new Photos();

export function convert(ctx: Context) {
	const profiler = profilerConvert.start();
	return toJSON(ctx.request)
		.catch((error) => {
			error.status = 400;
			throw error;
		})
		.then((body) => {
			const {input, output, format, area, presets, meta} = body;
			return photos
				.convert(input, output, format, area, presets, meta as Meta)
				.then((response: any) => {
					ctx.response.setHeader('X-COMPLETED-IN', profiler.end().result);
					return response;
				})
				.catch((error) => {
					if (error instanceof AccessError) {
						error.code = 403;
					}
					if (error instanceof ConvertError) {
						error
							.obscure('Conversion error. Code: ' + error.code)
							.code = 500;
					}
					throw error;
				});
		})
}
