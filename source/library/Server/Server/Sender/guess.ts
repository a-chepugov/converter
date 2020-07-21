import {Send} from './interface'
import json from "./json";
import base from "./base";
import stringable from "./stringable";

import {ServerResponse} from "http";

export class guess implements Send<ServerResponse, any> {
	static send = (response: ServerResponse, payload: any) => {
		const type = guess.typeOf(payload);
		const sender = guess.init(type);
		return sender.send(response, payload);
	}

	send(response: ServerResponse, payload: any) {
		return guess.send(response, payload);
	}

	static init = (type: string) => {
		switch (type) {
			case 'json':
				return json;
			case 'stringable':
				return stringable;
			default:
				return base;
		}
	}

	static typeOf = (payload: any) => {
		switch (true) {
			case typeof payload === 'object' && Object.getPrototypeOf(payload) === Object.prototype:
				return 'json';
			case typeof payload?.toString === 'function':
				return 'stringable';
		}
	}
}

export default guess;
