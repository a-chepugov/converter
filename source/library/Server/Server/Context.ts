import {IncomingMessage, ServerResponse} from "http";
import {Parser} from "./Parser";
import {Sender} from "./Sender";

export class Context {
	readonly request: IncomingMessage;
	readonly response: ServerResponse;
	readonly state: any;

	constructor({request, response, state}: { request: IncomingMessage, response: ServerResponse, state?: any }) {
		this.request = request;
		this.response = response;
		this.state = state;
		Object.freeze(this);
	}

	static of(request: IncomingMessage, response: ServerResponse, state?: any) {
		return new Context({request, response, state});
	}

	parse = (type?: string) => {
		return Parser.of(type).execute(this.request);
	}

	static parse = (type?: string) => (ctx: Context) => {
		return Parser.of(type).execute(ctx.request);
	}

	send = (payload: any, type?: string) => {
		return Sender.of(type).execute(this.response, payload);
	}

	static send = (type?: string) => (ctx: Context, payload: any) => {
		return Sender.of(type).execute(ctx.response, payload);
	}

	static install(plugin: (constructor: typeof Context.prototype.constructor) => void) {
		if (typeof plugin === 'function') {
			plugin(Context);
		} else {
			throw new Error('plugin must be a function');
		}
		return Context;
	}
}

export default Context;

export type ContextListener = (ctx: any, result: any) => any;
