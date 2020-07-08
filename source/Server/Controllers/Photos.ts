import {toJSON} from "../../library/Server/library/Stream";
import {Context} from "../../library/Server";

import Meta from "../../Models/Meta";

import Photos, {AccessError, ConvertError} from "../../Services/Photos";

const photos = new Photos();

export function convert({request, response, json}: Context) {
	return toJSON(request)
		.catch((error) => {
			error.status = 400;
			throw error;
		})
		.then((body) => {
			const {input, output, format, area, presets, meta} = body;
			return photos
				.convert(input, output, format, area, presets, meta as Meta)
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
