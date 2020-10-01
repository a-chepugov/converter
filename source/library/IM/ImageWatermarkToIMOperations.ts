import {Operators, Options, Settings} from 'imagemagick-cli-wrapper';
type Option = Options.Option;
import ImageWatermark from '../../Models/ImageWatermark';
import convertAlignToGravityType from './helpers/convertAlignToGravityType';

declare module "../../Models/ImageWatermark" {
	interface ImageWatermark {
		toIMOperations(): Option[];
	}
}

ImageWatermark.prototype.toIMOperations = function (): Option[] {
	const parameters = [];

	const gravityType = convertAlignToGravityType(this.align, this.valign);
	if (gravityType) {
		parameters.push(new Settings.Gravity(Settings.GravityType.NorthEast));
	}

	if (this.text) {
		parameters.push(new Operators.Repage());
		parameters.push(new Settings.Colorspace(Settings.ColorspaceType.RGB));
		parameters.push(new Settings.Pointsize(this.text.size));
		parameters.push(new Settings.Fill(this.text.color));
		parameters.push(new Settings.Font(this.text.font));
		parameters.push(new Operators.Annotate.DegreesXYTxTy(this.offset.degreesX, this.offset.degreesY, this.offset.x, this.offset.y, this.text.text))
	}

	return parameters;
};
