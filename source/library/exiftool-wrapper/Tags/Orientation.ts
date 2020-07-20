import Base from "./_Base";

export enum TYPES {
	'Horizontal' = 1,
	'Mirror horizontal' = 2,
	'Rotate 180' = 3,
	'Mirror vertical' = 4,
	'Mirror horizontal and rotate 270 CW' = 5,
	'Rotate 90 CW' = 6,
	'Mirror horizontal and rotate 90 CW' = 7,
	'Rotate 270 CW' = 8
}

export class Orientation extends Base {
	private readonly value: TYPES;

	constructor(value: TYPES) {
		super();
		this.value = value;
	}

	build(): string[] {
		return [`-orientation#="${this.value}"`];
	}
}

export default Orientation;
