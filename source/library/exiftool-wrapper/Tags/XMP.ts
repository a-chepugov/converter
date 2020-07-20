import Base from "./_Base";

export class XMP extends Base {
	private readonly name: string;
	private readonly value: string;

	constructor(name: string, value: string) {
		super();
		this.name = name;
		this.value = value;
	}

	build(): string[] {
		return [`-xmp:${this.name}="${this.value}"`];
	}
}

export default XMP;
