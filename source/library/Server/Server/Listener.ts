import {IncomingMessage, ServerResponse, STATUS_CODES} from "http";
import foldNextListeners from "./foldNextListeners";

export type RequestListener = (request: IncomingMessage, response: ServerResponse) => void;

import {Context, ContextListener} from "./Context";
export {Context, ContextListener} from "./Context";

import ReadableStream = NodeJS.ReadableStream;

export class Listener {
	private listeners: Set<ContextListener>;
	private bundle: ContextListener;
	public interceptor: (request: Context, error: any) => any;

	constructor(listeners?: Iterable<ContextListener>) {
		this.listeners = new Set(listeners);
		this.bundle = Listener.build(this.listeners);
		this.interceptor = (ctx: Context, error: any) => {
			try {
				if (!ctx.response.finished) {
					ctx.response.statusCode = error?.code ? error.code : 500;
					ctx.response.end(error?.message ? error.message : STATUS_CODES[ctx.response.statusCode]);
				}
				error.message += `: ${ctx.request.url}`;
				console.error(error);
			} catch (error) {
				console.error(error);
			}
		}
	}

	static build = (listeners: Iterable<ContextListener>) => {
		const folded = foldNextListeners(listeners);
		return (ctx: Context, initial: any): Promise<any> =>
			folded.execute((ctx: Context, result: Promise<any>) =>
				result, ctx, initial);
	}

	register = (listener: ContextListener) => {
		this.listeners.add(listener);
		this.bundle = Listener.build(this.listeners.values());
		return this;
	}

	unregister = (listener: ContextListener) => {
		this.listeners.delete(listener);
		this.bundle = Listener.build(this.listeners.values());
		return this;
	}

	listen: RequestListener = (request, response) => {
		const ctx = new Context({request, response});
		return this.bundle(ctx, undefined)
			.then((result: any) => {
				if (!ctx.response.finished) {
					switch (true) {
						case typeof result === 'string':
						case result instanceof Buffer:
							return ctx.send(result);
						case result instanceof ReadableStream:
							return ctx.send(result, 'stream');
						case typeof result === 'object' && Object.getPrototypeOf(result) === Object.prototype:
							return ctx.send(result, 'json');
						case typeof result?.toString === 'function':
							return ctx.send(result, 'stringable');
						default:
							return ctx.send(result);
					}
				}
			})
			.catch((error: any) => this.interceptor(ctx, error))
	}
}

export default Listener;
