import Base from "./_Base";

export class Charset extends Base {
	private readonly value: string;

	constructor(value: string) {
		super();
		this.value = value;
	}

	build(): string[] {
		return ['-charset', this.value];
	}
}

export default Charset;
