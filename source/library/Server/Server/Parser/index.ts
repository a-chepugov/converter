import {ParseConstructor} from "./interface";
import base from "./base";
import json from "./json";

export class Parser<T> {
	private readonly strategy: ParseConstructor<T>;

	constructor(strategy: ParseConstructor<T>) {
		this.strategy = strategy;
	}

	static registry = new Map<string, ParseConstructor<any>>();

	static register(name: string, strategy: ParseConstructor<any>) {
		Parser.registry.set(name, strategy);
		return Parser;
	}

	static of(type = 'base') {
		if (Parser.registry.has(type)) {
			return new Parser(Parser.registry.get(type));
		} else {
			return new Parser(base);
		}
	}

	execute(source: any) {
		return new this.strategy().parse(source);
	}
}

Parser
	.register('base', base)
	.register('json', json)

export default Parser;
