import {IncomingMessage, ServerResponse, STATUS_CODES} from "http";
import {RequestListener, NextRequestListener} from "./RequestListener";
import foldNextListeners from "./foldNextListeners";

export {foldNextListeners as foldListeners} from "./foldNextListeners";

import Context from "./Context";

export class Listener {
	private listeners: Set<NextRequestListener>;
	private bundle: NextRequestListener;
	public interceptor: (request: Context, error: any) => any;

	constructor() {
		this.listeners = new Set();
		this.bundle = Listener.build(this.listeners.values());
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

	static build = (listeners: Iterable<NextRequestListener>) => {
		const folded = foldNextListeners(listeners);
		return (ctx: Context, initial: any) => folded.execute((ctx: Context, result: any) => result, ctx, initial);
	}

	register = (listener: NextRequestListener) => {
		this.listeners.add(listener);
		this.bundle = Listener.build(this.listeners.values());
		return this
	}

	unregister = (listener: NextRequestListener) => {
		this.listeners.delete(listener);
		this.bundle = Listener.build(this.listeners.values());
		return this
	}

	listen: RequestListener = (request: IncomingMessage, response: ServerResponse) => {
		const ctx = new Context(request, response);
		return this.bundle(ctx, undefined)
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
