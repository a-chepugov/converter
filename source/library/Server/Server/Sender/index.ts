import {SendConstructor} from "./interface";

import base from "./base";
import json from "./json";
import stream from "./stream";
import stringable from "./stringable";
import guess from "./guess";

export class Sender<T> {
	private readonly strategy: SendConstructor<T>;

	constructor(strategy: SendConstructor<T>) {
		this.strategy = strategy;
	}

	static registry = new Map();

	static register(name: string, strategy: SendConstructor<any>) {
		Sender.registry.set(name, strategy);
		return Sender;
	}

	static of(type: string) {
		if (Sender.registry.has(type)) {
			return new Sender(Sender.registry.get(type));
		} else {
			return new Sender(Sender.registry.get('guess'));
		}
	}

	execute(target: any, payload: T) {
		return new this.strategy(target).send(payload);
	}
}

Sender
	.register('base', base)
	.register('json', json)
	.register('stream', stream)
	.register('stringable', stringable)
	.register('guess', guess)

export default Sender;
