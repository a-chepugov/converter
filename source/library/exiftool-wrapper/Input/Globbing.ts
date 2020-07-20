import Input from "./_Input";

export class Globbing implements Input {
	private readonly name: string;

	constructor(name: string) {
		this.name = name;
	}

	static of(name: string) {
		return new Globbing(name);
	}

	build(): string[] {
		return [this.name];
	}

	inspect(): string {
		return this.build().join(' ');
	}
}

export default Globbing;
