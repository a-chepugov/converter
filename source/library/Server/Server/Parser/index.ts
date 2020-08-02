import {Parse} from "./interface";
import {Registry} from "../../library/Registry";

export class Parser {
	private static registry = new Registry<string, Parse<any, any>>();

	static register(name: string, strategy: Parse<any, any>) {
		Parser.registry.set(name, strategy);
		return Parser;
	}

	static of(type: string) {
		const registry = Parser.registry;
		if (type && registry.has(type)) {
			return registry.get(type);
		} else {
			return registry.get('base');
		}
	}

}

export default Parser;

import base from "./base";
import json from "./json";

Parser
	.register('base', base)
	.register('json', json)
;
