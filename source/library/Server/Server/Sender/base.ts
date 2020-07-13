import {ServerResponse} from "http";
import {Send} from "./interface";

export class base<T> implements Send<T>{
	protected readonly response: ServerResponse;

	constructor(response: ServerResponse) {
		this.response = response;
	}

	send(payload: T) {
		return this.response.end(payload);
	};
}

export default base;
