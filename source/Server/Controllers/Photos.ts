import {Context} from "../../library/Server";
import {Profiler} from "../../library/Profiler";

import Photos, {AccessError, InputError, ConvertError, InvalidPresetError} from "../../Services/Photos";

const ProfilerDate = Profiler.factory();
const profilerConvert = ProfilerDate.of('Photos')

const photos = new Photos();

const convertErrorHandler = (error: any) => {
	if (error instanceof AccessError) {
		error.reason = error.message;
		error.code = 403;
	}
	if (error instanceof InvalidPresetError) {
		error.reason = error.message;
		error.code = 422;
	}
	if (error instanceof InputError) {
		error.reason = error.message;
		error.code = 422;
	}
	if (error instanceof ConvertError) {
		error.reason = `Conversion error. Code: ${error.code}. ${error.message}`;
		error.code = 500;
	}
	throw error;
}

export function convertWithAreaPresets(ctx: Context, body: { [key: string]: any }) {
	const profiler = profilerConvert.start(':convertByPreset');
	const {input, output, name, area, presets, meta} = body;
	return photos
		.convertWithAreaPresets(area, presets, input, output, name, meta)
		.then((response: any) => {
			ctx.response.setHeader('X-COMPLETED-IN', profiler.end().result);
			return response;
		})
		.catch(convertErrorHandler);
}

export function convertMixed(ctx: Context, body: { [key: string]: any }) {
	const profiler = profilerConvert.start(':convertMixed');
	const {input, output, name, area, presets, meta} = body;
	return photos.convertMixed(area, presets, input, output, name, meta)
		.then((response: any) => {
			ctx.response.setHeader('X-COMPLETED-IN', profiler.end().result);
			return response;
		})
		.catch(convertErrorHandler);
}

export function convert(ctx: Context, body: { [key: string]: any }) {
	const profiler = profilerConvert.start(':convertWithPresets');
	const {input, output, name, presets, meta} = body;
	return photos.convert(presets, input, output, name, meta)
		.then((response: any) => {
			ctx.response.setHeader('X-COMPLETED-IN', profiler.end().result);
			return response;
		})
		.catch(convertErrorHandler);
}

