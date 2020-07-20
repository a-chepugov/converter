import Base from "./_Base";

export class Artist extends Base {
	private readonly value: string;

	constructor(value: string) {
		super();
		this.value = value;
	}

	build(): string[] {
		return [`-artist="${this.value}"`];
	}
}

export default Artist;
