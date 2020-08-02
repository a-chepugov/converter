import {IncomingMessage, ServerResponse} from "http";
import {Parser} from "./Parser";
import {Sender} from "./Sender";

export {Parser} from "./Parser";
export {Sender} from "./Sender";

export class Context {
	readonly request: IncomingMessage;
	readonly response: ServerResponse;
	readonly state: any;

	constructor(request: IncomingMessage, response: ServerResponse, state?: any) {
		this.request = request;
		this.response = response;
		this.state = state;
		Object.freeze(this);
	}

	parse(type?: string) {
		return Parser.of(type).parse(this.request);
	}

	static parse(type?: string) {
		return function (ctx: Context) {
			return Parser.of(type).parse(ctx.request)
		}
	}

	send(payload: any, type?: string) {
		return Sender.of(type).send(this.response, payload);
	}

	static send(type?: string) {
		return function (ctx: Context, payload: any) {
			return Sender.of(type).send(ctx.response, payload)
		}
	}

	static with(plugin: (target: typeof Context) => any) {
		if (typeof plugin === 'function') {
			plugin(Context);
			return Context;
		} else {
			throw new Error('plugin must be a function');
		}
	}

	overlay(properties: { [key: string]: any }) {
		return Object.create(this, properties);
	}
}

export default Context;

export type ContextListener = (ctx: any, input?: any) => any;
