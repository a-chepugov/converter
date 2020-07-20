import Base from "./_Base";

export class ImageDescription extends Base {
	private readonly value: string;

	constructor(value: string) {
		super();
		this.value = value;
	}

	build(): string[] {
		return [`-imagedescription="${this.value}"`];
	}
}

export default ImageDescription;
