import {IncomingMessage, ServerResponse, STATUS_CODES} from "http";
import foldNextListeners from "./foldNextListeners";

export type RequestListener = (request: IncomingMessage, response: ServerResponse) => void;

import {Context, ContextListener} from "./Context";

export {Context, ContextListener} from "./Context";

export class Controller {
	protected readonly listeners: Set<ContextListener>;
	protected _bundle: ContextListener;
	protected _state: (request: IncomingMessage, response: ServerResponse) => any;
	protected _interceptor: (ctx: any, error: any) => any;

	constructor(listeners?: Iterable<ContextListener>) {
		this.listeners = new Set(listeners);
		this._bundle = Controller.build(this.listeners);
		this._state = () => undefined;
		this.interceptor((ctx: Context, error: { code?: number, reason?: string }) => {
			if (!ctx.response.finished) {
				ctx.response.statusCode = error?.code ? error.code : 500;
				ctx.response.end(error?.reason ? error.reason : STATUS_CODES[ctx.response.statusCode]);
			}
			console.error(error);
		})
	}

	interceptor(interceptor: (ctx: Context, error: any) => any) {
		if (typeof interceptor === 'function') {
			this._interceptor = interceptor;
		} else {
			throw new Error('Interceptor mush be a function');
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
		this._bundle = Controller.build(this.listeners.values());
		return this;
	}

	unregister = (listener: ContextListener) => {
		this.listeners.delete(listener);
		this._bundle = Controller.build(this.listeners.values());
		return this;
	}

	listen: RequestListener = (request, response) => {
		const ctx = new Context(request, response, Object.seal(this._state(request, response)));
		return this._bundle(ctx, undefined)
			.then((result: any) => ctx.response.finished ? undefined : ctx.send(result))
			.catch((error: any) => this._interceptor(ctx, error))
	}

	modify(modifier: (this: this) => any) {
		if (typeof modifier === 'function') {
			modifier.call(this);
			return this;
		} else {
			throw new Error('modifier must be a function');
		}
	}

	state(setter: (request: IncomingMessage, response: ServerResponse) => any) {
		if (typeof setter === 'function') {
			this._state = setter;
			return this;
		} else {
			throw new Error('State setter must be a function');
		}
	}

	static with(plugin: (target: typeof Controller) => any) {
		if (typeof plugin === 'function') {
			plugin(Controller);
			return Controller;
		} else {
			throw new Error('plugin must be a function');
		}
	}

	static context(plugin: (constructor: typeof Context) => any) {
		if (typeof plugin === 'function') {
			Context.with(plugin);
			return Controller;
		} else {
			throw new Error('plugin must be a function');
		}
	}
}

export default Controller;
