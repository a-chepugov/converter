import {Geometry, Operators, SequenceOperators, Settings, Expressions} from 'imagemagick-cli-wrapper';

const Fx = Expressions.Fx;

import {ResizeMethod} from "../../../Models/Preset"

const expressedSizesWithFx = (width: number, height: number) => [new Fx(`w>=h?${width}:${height}`), new Fx(`w>=h?${height}:${width}`)];

export function convertParamsToResizeOperations(width: number, height: number, method: ResizeMethod) {
	const [widthFx, heightFx] = expressedSizesWithFx(width, height);
	switch (method) {
		case 'shrink':
			return [
				new Operators.Resize(new Geometry.Shrink(widthFx, heightFx))
			];
		case 'trim':
			return [
				new Operators.Resize(new Geometry.Minimum(widthFx, heightFx)),
				new Operators.Repage(),
				new Settings.Gravity(Settings.GravityType.Center),
				new SequenceOperators.Crop(new Geometry.Offsetted(new Geometry.Maximum(widthFx, heightFx), new Geometry.Offset(0, 0))),
			 ];
		case 'scale':
			return [new Operators.Resize(new Geometry.Maximum(widthFx, heightFx))];
		default:
			throw new Error(`Unsupported method: ${method}`);
	}
}

export default convertParamsToResizeOperations;
