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

	parse = (type?: string) => {
		return Parser.of(type).execute(this.request);
	}

	send = (payload: any, type?: string) => {
		return Sender.of(type).execute(payload, this.response);
	}

}

export default Context;
