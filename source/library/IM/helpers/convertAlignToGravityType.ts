import {Settings} from 'imagemagick-cli-wrapper';

const GravityType = Settings.GravityType;

export function convertAlignToGravityType(
	align: 'left' | 'center' | 'right',
	valign: 'top' | 'center' | 'bottom'
) {
	switch (true) {
		case align === 'left':
			switch (true) {
				case valign === 'top':
					return GravityType.NorthWest;
				case valign === 'bottom':
					return GravityType.SouthWest;
				case valign === 'center':
				default:
					return GravityType.West;
			}
		case align === 'center':
			switch (true) {
				case valign === 'top':
					return GravityType.North;
				case valign === 'bottom':
					return GravityType.South;
				case valign === 'center':
				default:
					return GravityType.Center;
			}
		case align === 'right':
			switch (true) {
				case valign === 'top':
					return GravityType.NorthEast;
				case valign === 'bottom':
					return GravityType.SouthEast;
				case valign === 'center':
				default:
					return GravityType.East;
			}
		default:
			switch (true) {
				case valign === 'top':
					return GravityType.North;
				case valign === 'bottom':
					return GravityType.South;
				case valign === 'center':
					return GravityType.Center;
			}
	}
}

export default convertAlignToGravityType;
