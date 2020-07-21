import {Send} from "./interface";
import {Registry} from "../../library/Registry";

export class Sender {
	static registry = new Registry<string, Send<any, any>>();

	static register(name: string, strategy: Send<any, any>) {
		Sender.registry.set(name, strategy);
		return Sender;
	}

	static of(type?: string) {
		if (Sender.registry.has(type)) {
			return Sender.registry.get(type);
		} else {
			return Sender.registry.get('guess');
		}
	}
}

export default Sender;

import base from "./base";
import json from "./json";
import stream from "./stream";
import stringable from "./stringable";
import guess from "./guess";

Sender
	.register('base', base)
	.register('json', json)
	.register('stream', stream)
	.register('stringable', stringable)
	.register('guess', guess)
;
