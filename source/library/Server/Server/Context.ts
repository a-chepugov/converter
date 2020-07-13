import {IncomingMessage, ServerResponse} from "http";

export class Context {
	readonly request: IncomingMessage;
	readonly response: ServerResponse;

	constructor({request, response}: { request: IncomingMessage, response: ServerResponse }) {
		this.request = request;
		this.response = response;
		Object.freeze(this);
	}

	send = (payload: any) => this.response.end(payload.toString())

	json = (payload: any) => {
		const result = JSON.stringify(payload);
		this.response.setHeader('Content-Type', 'application/json');
		this.response.end(result);
	}
}

export default Context;
