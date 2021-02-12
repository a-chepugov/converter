import {Tag} from './Tags';

export type Option = Tag;

export class Options {
	readonly options: Option[];

	constructor() {
		this.options = [];
	}

	push(options: Option) {
		this.options.push(options);
		return this;
	}

	unshift(options: Option) {
		this.options.unshift(options);
		return this;
	}

	append(options: Iterable<Option>) {
		this.options.splice(this.options.length, 0, ...Array.from(options));
		return this;
	}

	prepend(options: Iterable<Option>) {
		this.options.splice(0, 0, ...Array.from(options));
		return this;
	}

	concat(options: Options) {
		return new Options()
			.append(this.options)
			.append(options.options);
	}

	static of(operations: Iterable<Option>) {
		return new Options()
			.append(operations);
	}

	build(): string[] {
		return this.options.reduce((result: string[], operation: Option) => result.concat(operation.build()), []);
	}

	inspect() {
		return this.options.reduce((result: string[], operation: Option) => result.concat(operation.inspect()), []).join(' ');
	}
}

export default Options;
