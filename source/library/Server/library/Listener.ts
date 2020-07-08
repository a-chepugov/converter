import {IncomingMessage, ServerResponse, STATUS_CODES} from "http";
import {RequestListener, NextRequestListener} from "./RequestListener";
import foldNextListeners from "./foldNextListeners";

import Context from "./Context";

export class Listener {
	private listeners: Set<NextRequestListener>;
	public interceptor: (request: Context, error: any) => any;

	constructor() {
		this.listeners = new Set();
		this.interceptor = (ctx: Context, error: any) => {
			try {
				if (!ctx.response.finished) {
					ctx.response.statusCode = error?.code ? error?.code : 500;
					ctx.response.end(error?.message ? error.message : STATUS_CODES[ctx.response.statusCode]);
				}
				error.message += `: ${ctx.request.url}`;
				console.error(error);
			} catch (error) {
				console.error(error);
			}
		}
	}

	register = (listener: NextRequestListener) => {
		this.listeners.add(listener);
		return this;
	}

	unregister = (listener: NextRequestListener) => {
		this.listeners.delete(listener);
		return this;
	}

	listen: RequestListener = (request: IncomingMessage, response: ServerResponse) => {
		const ctx = new Context(request, response);
		return foldNextListeners(this.listeners.values())(ctx, undefined)
			.then((result: any) => {
				if (!ctx.response.finished) {
					switch (true) {
						case result instanceof Buffer: {
							result.pipe(ctx.response);
							break;
						}
						case typeof result?.toString === 'function': {
							ctx.response.end(result.toString());
							break;
						}
						default:
							ctx.response.end(result);
					}
				}
			})
			.catch((error: any) => this.interceptor(ctx, error))
	}
}

export default Listener;
