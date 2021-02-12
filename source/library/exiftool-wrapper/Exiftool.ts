import {Input} from './Input';
import {Option, Options} from './Options';

export class Exiftool {
	inputs: Input[];
	options: Options;

	constructor() {
		this.options = new Options();
	}

	from(inputs: Iterable<Input>) {
		this.inputs = Array.from(inputs);
		return this;
	}

	append(options: Option[]) {
		this.options.append(options);
		return this;
	}

	with(option: Option) {
		this.options.push(option);
		return this;
	}

	inspect() {
		return ['exiftool', Options.of(this.inputs).concat(this.options).inspect()].join(' ');
	}

	build() {
		if (Array.isArray(this.inputs) && this.inputs.length) {
			return ['exiftool'].concat(Options.of(this.inputs).concat(this.options).build());
		} else {
			throw new Error('Invalid input data for operation');
		}
	}

	static of(inputs: Iterable<Input>) {
		return new Exiftool().from(inputs);
	}
}

export default Exiftool;
