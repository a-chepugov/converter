import {IncomingMessage, ServerResponse} from "http";
import {generate} from "../../library/HEX";

export class State {
	readonly request: IncomingMessage;
	readonly response: ServerResponse;
	private _id: string;

	constructor(request: IncomingMessage, response: ServerResponse) {
		this.request = request;
		this.response = response;
		this._id = '';
	}

	get id() {
		if (this._id === '') {
			const requestId = this.request.headers['request-id'];
			this._id = Array.isArray(requestId) ? requestId[0] : requestId ? requestId : generate(36);
		}
		return this._id;
	}

	static of(request: IncomingMessage, response: ServerResponse) {
		return new State(request, response);
	}
}

export default State;
