import {IncomingMessage, ServerResponse} from "http";
import {Parser} from "./Parser";
import {Sender} from "./Sender";

export {Parser} from "./Parser";
export {Sender} from "./Sender";

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

	parse(type?: string) {
		return Parser.of(type).parse(this.request);
	}

	static parse = (type?: string) => (ctx: Context): any => Parser.of(type).parse(ctx.request);

	send(payload: any, type?: string) {
		return Sender.of(type).send(this.response, payload);
	}

	static send = (type?: string) => (ctx: Context, payload: any) => Sender.of(type).send(ctx.response, payload);

	static with(plugin: (target: typeof Context) => any) {
		if (typeof plugin === 'function') {
			plugin(Context);
			return Context;
		} else {
			throw new Error('plugin must be a function');
		}
	}

	overlay(extra: { [key: string]: any }) {
		return Object.create(this, extra);
	}
}

export default Context;

export type ContextListener = (ctx: any, result: any) => any;
