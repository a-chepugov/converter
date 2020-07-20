import base from './base'
import json from "./json";
import stringable from "./stringable";

import ReadableStream = NodeJS.ReadableStream;

export class guess extends base<ReadableStream> {
	send = (payload: ReadableStream) => {
		const type = this.typeOf(payload);
		const sender = this.init(type);
		return sender.send(payload);
	}

	protected init = (type: string) => {
		switch (type) {
			case 'json':
				return new json(this.response);
			case 'stringable':
				return new json(this.response);
			default:
				return new base(this.response);
		}
	}

	protected typeOf = (payload: any) => {
		switch (true) {
			case typeof payload === 'object' && Object.getPrototypeOf(payload) === Object.prototype:
				return 'json';
			case typeof payload?.toString === 'function':
				return 'stringable';
		}
	}
}

export default guess;
