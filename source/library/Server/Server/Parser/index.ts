import {ParseConstructor} from "./interface";
import base from "./base";
import json from "./json";

export class Parser<T> {
	private readonly strategy: ParseConstructor<T>;

	constructor(strategy: ParseConstructor<T>) {
		this.strategy = strategy;
	}

	static of(type = 'base') {
		switch (type) {
			case 'json':
				return new Parser(json);
			case 'base':
			default:
				return new Parser(base);
		}
	}

	execute(source: any) {
		return new this.strategy().parse(source);
	}
}

export default Parser;
