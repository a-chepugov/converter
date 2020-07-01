import {Settings} from 'imagemagick-cli-wrapper';

const InterlaceType = Settings.InterlaceType;

export function convertStringToInterlaceType(type: string) {
	switch (type) {
		case "none":
			return InterlaceType.none;
		case "line":
			return InterlaceType.line;
		case "plane":
			return InterlaceType.plane;
		case "partition":
			return InterlaceType.partition;
		default:
			throw new Error(`Unsupported interlace type: ${type}`);
	}
}

export default convertStringToInterlaceType;
