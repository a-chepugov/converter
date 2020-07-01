import {Geometry} from 'imagemagick-cli-wrapper';

export function convertParamsToGeometry(method: 'trim' | 'scale', width: number, height: number) {
	switch (method) {
		case 'trim':
			return new Geometry.Shrink(width, height);
		case 'scale':
			return new Geometry.Maximum(width, height);
		default:
			throw new Error(`Unsupported method: ${method}`);
	}
}

export default convertParamsToGeometry;
