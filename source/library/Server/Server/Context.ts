import {IncomingMessage, ServerResponse} from "http";
import {Parser} from "./Parser";
import {Sender} from "./Sender";

export class Context {
	readonly request: IncomingMessage;
	readonly response: ServerResponse;

	constructor({request, response}: { request: IncomingMessage, response: ServerResponse }) {
		this.request = request;
		this.response = response;
		Object.freeze(this);
	}

	static of(request: IncomingMessage, response: ServerResponse) {
		return new Context({request, response});
	}

	parse = (type?: string) => {
		return Parser.of(type).execute(this.request);
	}

	send = (payload: any, type?: string) => {
		if (!type) {
			switch (true) {
				case typeof payload === 'object' && Object.getPrototypeOf(payload) === Object.prototype:
					type = 'json';
					break;
				case typeof payload?.toString === 'function':
					type = 'stringable';
					break;
			}
		}

		return Sender.of(type).execute(this.response, payload);
	}

}

export default Context;

export type ContextListener = (ctx: any, result: any) => any;
