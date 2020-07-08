import {STATUS_CODES} from "http";

import * as url from "url";

import Method from "./library/Method";

import foldNextListeners from "./library/foldNextListeners";
import {NextRequestListener} from "./library/RequestListener";
import Context from "./library/Context";

type RouteMatcher = string | RegExp;
type RouteHandler = NextRequestListener;

export class Router {
	protected _handlers: Map<Method, Map<RegExp, RouteHandler>>;

	constructor() {
		this._handlers = new Map();
	}

	get handlers() {
		return Array
			.from(this._handlers.entries())
			.reduce((accumulator: any, [method, handlers]) => {
				accumulator.set(method, new Map(handlers));
				return accumulator;
			}, new Map);
	}

	private setRouterHandler(method: Method, matcher: RouteMatcher, handler: RouteHandler) {
		method = String.prototype.toLocaleUpperCase.call(method);
		let methodHandlers = this._handlers.get(method)

		if (!methodHandlers) {
			methodHandlers = new Map();
			this._handlers.set(method, methodHandlers);
		}
		if (typeof matcher === 'string') {
			const matchedWithGroups = matcher.replace(/\/:(\w+)/g, '/(?<$1>\\w*)');
			const regexp = new RegExp(`^${matchedWithGroups}$`);
			methodHandlers.set(regexp, handler);
		} else {
			methodHandlers.set(matcher, handler);
		}
		return this;
	}

	private getRouterHandler(method: Method, pathname: string): [RouteHandler, { [key: string]: string } | undefined] | undefined {
		method = String.prototype.toLocaleUpperCase.call(method);
		const methodHandlers = this._handlers.get(method);
		if (methodHandlers) {
			const entriesIterator = methodHandlers.entries();
			for (let item of entriesIterator) {
				const [matcher, handler] = item;
				const result = matcher.exec(pathname)
				if (result) {
					return [handler, result.groups];
				}
			}
		}
	}

	on = (method: Method, matcher: RouteMatcher, ...listeners: RouteHandler[]) => {
		const listener = listeners.length === 1 ? listeners[0] : foldNextListeners(listeners);
		this.setRouterHandler(method, matcher, listener);
		return this;
	}

	from = (source: Router): Router => {
		return Array
			.from(source.handlers)
			.reduce((self: Router, [method, handlers]) => {
				return Array
					.from(handlers.entries())
					.reduce((self: Router, [regexp, handler]) => {
						return self.on(method, regexp, handler);
					}, self)
			}, this) as Router;
	}


	concat = (router: Router): Router => {
		return (new Router()).from(this).from(router);
	}

	listen: NextRequestListener = (ctx: Context, result: any) => {
		const anUrl = url.parse(ctx.request.url);
		const [handler, parameters] = this.getRouterHandler(ctx.request.method, anUrl.pathname) || [];
		if (handler) {
			ctx.parameters = Object.assign({}, parameters);
			return new Promise((resolve, reject) => {
				try {
					return resolve(handler(ctx, result));
				} catch (error) {
					reject(error);
				}
			});
		} else {
			const error = new Error(STATUS_CODES[404]);
			// @ts-ignore
			error.status = 404;
			return Promise.reject(error);
		}
	}
}

export default Router;

const router = new Router();








