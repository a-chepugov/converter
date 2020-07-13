import {SendConstructor} from "./interface";

import base from "./base";
import json from "./json";
import stream from "./stream";
import stringable from "./stringable";

export class Sender<T> {
	private readonly strategy: SendConstructor<T>;

	constructor(strategy: SendConstructor<T>) {
		this.strategy = strategy;
	}

	static of(type = 'base') {
		switch (type) {
			case 'json':
				return new Sender(json);
			case 'stream':
				return new Sender(stream);
			case 'stringable':
				return new Sender(stringable);
			case 'buffer':
			case 'base':
			default:
				return new Sender(base);
		}
	}

	execute(payload: T, target: any) {
		return new this.strategy(target).send(payload);
	}
}

export default Sender;
