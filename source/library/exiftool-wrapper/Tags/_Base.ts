import {Tag} from './_Tag';

export abstract class Base implements Tag {
	abstract build(): string[];

	inspect(): string {
		return this.build().join(' ');
	}
}

export default Base;
