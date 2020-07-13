import {IncomingMessage, ServerResponse} from "http";
import {Parser} from "./Parser";
import {Sender} from "./Sender";

export class Context {
	readonly request: IncomingMessage;
	readonly response: ServerResponse;
	readonly state: any;

	constructor({request, response}: { request: IncomingMessage, response: ServerResponse }, state?: any) {
		this.request = request;
		this.response = response;
		this.state = Object.create(typeof state === 'object' ? state : null);
		Object.freeze(this.state);
		Object.freeze(this);
	}

	static of(request: IncomingMessage, response: ServerResponse, state: any) {
		return new Context({request, response}, state);
	}

	parse = (type?: string) => {
		return Parser.of(type).execute(this.request);
	}

	send = (payload: any, type?: string) => {
		return Sender.of(type).execute(this.response, payload);
	}

}

export default Context;

export type ContextListener = (ctx: Context, result: any) => any;
