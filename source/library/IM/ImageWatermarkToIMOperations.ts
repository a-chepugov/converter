import {Input, Operators,	Option,	Settings,	SequenceOperators,StacksOperations,	Geometry} from 'imagemagick-cli-wrapper';
import {ImageWatermark, ImageWatermarkText, ImageWatermarkImage} from '../../Models/ImageWatermark';
import convertAlignToGravityType from './helpers/convertAlignToGravityType';
import * as path from "path";

declare module "../../Models/ImageWatermark" {
	interface ImageWatermark {
		toIMOperations(): Option[];
	}
}

ImageWatermarkText.prototype.toIMOperations = function (): Option[] {
	const parameters: Option[] = [];

	const gravityType = convertAlignToGravityType(this.align, this.valign);
	if (gravityType) {
		parameters.push(new Settings.Gravity(gravityType));
	}

	parameters.push(new Settings.Background('none'));

	if (this.text.color) {
		parameters.push(new Settings.Fill(this.text.color));
	}
	if (this.text.size) {
		parameters.push(new Settings.Pointsize(this.text.size));
	}
	if (this.text.font) {
		parameters.push(new Settings.Font(this.text.font));
	}

	parameters.push(new Operators.Annotate.DegreesXYTxTy(this.rotate, this.rotate, this.offset.x, this.offset.y, this.text.text))

	return parameters;
};

const inputsDir = path.join('.', 'input');

ImageWatermarkImage.prototype.toIMOperations = function (): Option[] {
	const parameters: Option[] = [];

	parameters.push(new Input.Globbing(path.join(inputsDir, this.source)));

	const gravityType = convertAlignToGravityType(this.align, this.valign);
	if (gravityType) {
		parameters.push(new Settings.Gravity(gravityType));
	}

	parameters.push(new Settings.Background('none'));

	if (this.rotate) {
		parameters.push(new Operators.Rotate(this.rotate));
	}

	if (this.size) {
		parameters.push(new Operators.Resize(new Geometry.Scale(this.size)));
	}

	if (this.offset) {
		parameters.push(new Operators.Geometry(new Geometry.Offsetted(undefined, new Geometry.Offset(this.offset.x, this.offset.y))));
	}

	return [new StacksOperations.Group(parameters), new SequenceOperators.Composite()];
};
