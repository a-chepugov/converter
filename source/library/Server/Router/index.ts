import {STATUS_CODES} from "http";
import * as url from "url";

import Method from "./Method";

import {ContextListener} from "../Server/RequestListener";
import {Listener, Context as ListenerContext} from "../Server/Listener";

import {Context} from "./Context";

export {Context} from "./Context";

type RouteMatcher = string | RegExp;
type RouteHandler = (ctx: Context, result: any) => any;

export class Router {
	protected _handlers: Map<Method, Map<RouteMatcher, { pattern: RegExp, handler: RouteHandler }>>;

	constructor() {
		this._handlers = new Map();
		Object.freeze(this);
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
			const pattern = new RegExp(`^${matchedWithGroups}$`);
			methodHandlers.set(matcher, {pattern, handler});
		} else {
			methodHandlers.set(matcher, {pattern: matcher, handler});
		}
		return this;
	}

	private getRouterHandler(method: Method, pathname: string): [RouteHandler, { [key: string]: string } | undefined] | undefined {
		method = String.prototype.toLocaleUpperCase.call(method);
		const methodHandlers = this._handlers.get(method);
		if (methodHandlers) {
			const entriesIterator = methodHandlers.values();
			for (let item of entriesIterator) {
				const {pattern, handler} = item;
				const result = pattern.exec(pathname)
				if (result) {
					return [handler, result.groups];
				}
			}
		}
	}

	on = (method: Method, matcher: RouteMatcher, ...listeners: RouteHandler[]) => {
		const listener = listeners.length === 1 ? listeners[0] : Listener.build(listeners);
		this.setRouterHandler(method, matcher, listener);
		return this;
	}

	listen: ContextListener = (ctx: ListenerContext, result: any) => {
		const anUrl = url.parse(ctx.request.url);
		const [handler, parameters] = this.getRouterHandler(ctx.request.method, anUrl.pathname) || [];
		if (handler) {
			const routeContext = Context.from(ctx, parameters);
			return new Promise((resolve, reject) => {
				try {
					resolve(handler(routeContext, result));
				} catch (error) {
					reject(error);
				}
			});
		} else {
			const error = new Error(STATUS_CODES[404]);
			// @ts-ignore
			error.code = 404;
			return Promise.reject(error);
		}
	}

	append = (source: Router): Router => {
		return Array
			.from(source.handlers)
			.reduce((self: Router, [method, handlers]) => {
				return Array
					.from(handlers.entries())
					.reduce((self: Router, [matcher, {handler}]) => {
						return self.on(method, matcher, handler);
					}, self)
			}, this) as Router;
	}

	concat = (router: Router): Router => (new Router()).append(this).append(router)
}

export default Router;
