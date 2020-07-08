import {IncomingMessage, ServerResponse} from "http";

export class Context {
	readonly request: IncomingMessage;
	readonly response: ServerResponse;
	private _parameters: { [key: string]: string };

	constructor(request: IncomingMessage, response: ServerResponse) {
		this.request = request;
		this.response = response;
		this.parameters = {};
	}

	get parameters() {
		return this._parameters;
	};

	set parameters(parameters: { [key: string]: string }) {
		this._parameters = parameters;
	};

	get body() {
		return
	}

	send = (payload: any) => this.response.end(payload.toString())

	json = (payload: any) => {
		const result = JSON.stringify(payload);
		this.response.setHeader('Content-Type', 'application/json');
		this.response.end(result);
	}
}

export default Context;
