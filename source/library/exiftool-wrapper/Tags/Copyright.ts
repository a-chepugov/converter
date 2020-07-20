import Base from "./_Base";

export class Copyright extends Base {
	private readonly value: string;

	constructor(value: string) {
		super();
		this.value = value;
	}

	build(): string[] {
		return [`-copyright="${this.value}"`];
	}
}

export default Copyright;
