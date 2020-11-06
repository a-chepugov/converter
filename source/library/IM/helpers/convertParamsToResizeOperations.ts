import {Geometry, Operators, SequenceOperators, Settings} from 'imagemagick-cli-wrapper';

import {RESIZE_METHOD} from "../../../Models/Preset"

export function convertParamsToResizeOperations(method: RESIZE_METHOD, width: number, height: number) {
	switch (method) {
		case 'shrink':
			return [
				new Operators.Resize(new Geometry.Shrink(width, height))
			];
		case 'trim':
			return [
				new Operators.Resize(new Geometry.Minimum(width, height)),
				new Operators.Repage(),
				new Settings.Gravity(Settings.GravityType.Center),
				new SequenceOperators.Crop(new Geometry.Offsetted(new Geometry.Maximum(width, height), new Geometry.Offset(0, 0))),
			 ];
		case 'scale':
			return [new Operators.Resize(new Geometry.Maximum(width, height))];
		default:
			throw new Error(`Unsupported method: ${method}`);
	}
}

export default convertParamsToResizeOperations;
