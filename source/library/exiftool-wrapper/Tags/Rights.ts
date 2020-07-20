import Base from "./_Base";

export class Rights extends Base {
	private readonly value: string;

	constructor(value: string) {
		super();
		this.value = value;
	}

	build(): string[] {
		return [`-rights="${this.value}"`];
	}
}

export default Rights;
