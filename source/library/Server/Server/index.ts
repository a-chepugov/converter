import * as http from 'http';

import {RequestListener, Controller, Context, ContextListener} from "./Controller";

export {RequestListener, Controller, Context, ContextListener} from "./Controller";

export class ServerCore {
	protected readonly _listener: RequestListener;
	protected readonly _server: http.Server;
	protected _port: number;
	protected _host: string;
	protected _backlog: number;

	constructor(listener: RequestListener) {
		Object.defineProperty(this, '_listener', {value: listener});
		Object.defineProperty(this, '_server', {value: http.createServer(this._listener)});
	}

	host(host: string) {
		Object.defineProperty(this, '_host', {value: host});
		return this;
	}

	port(port: number) {
		Object.defineProperty(this, '_port', {value: port});
		return this;
	}

	backlog(backlog: number) {
		Object.defineProperty(this, '_backlog', {value: backlog});
		return this;
	}

	on(host: string, port: number) {
		return this.host(host).port(port);
	}

	start = (callback?: () => void) => {
		this._server.listen(this._port, this._host, this._backlog, callback);
		return this;
	}

	get server() {
		return this._server;
	}
}

export class Server extends ServerCore {
	protected readonly _controller: Controller;

	private constructor(controller: Controller) {
		super(controller.listen);
		Object.defineProperty(this, '_controller', {value: controller});
	}

	static create(listeners?: Iterable<ContextListener>) {
		const listener = new Controller(listeners);
		return new Server(listener);
	}

	interceptor = (interceptor: (ctx: Context, error: any) => void) => {
		this._controller.interceptor(interceptor);
		return this;
	}

	use = (nextRequestListener: ContextListener) => {
		this._controller.register(nextRequestListener);
		return this;
	}

	unuse = (nextRequestListener: ContextListener) => {
		this._controller.unregister(nextRequestListener);
		return this;
	}

	modify(modifier: (this: this) => any) {
		if (typeof modifier === 'function') {
			modifier.call(this);
			return this;
		} else {
			throw new Error('modifier must be a function');
		}
	}

	controller(modifier: (this: Controller) => any) {
		if (typeof modifier === 'function') {
			this._controller.modify(modifier);
			return this;
		} else {
			throw new Error('modifier must be a function');
		}
	}

	state = (setter: (request: http.IncomingMessage, response: http.ServerResponse) => any) => {
		this._controller.state(setter);
		return this;
	};

	static with(plugin: (target: typeof Server) => any) {
		if (typeof plugin === 'function') {
			plugin(Server);
			return Server;
		} else {
			throw new Error('plugin must be a function');
		}
	}

	static controller(plugin: (constructor: typeof Controller) => any) {
		if (typeof plugin === 'function') {
			Controller.with(plugin);
			return Server;
		} else {
			throw new Error('plugin must be a function');
		}
	}

	static context(plugin: (constructor: typeof Context) => any) {
		if (typeof plugin === 'function') {
			Controller.context(plugin);
			return Server;
		} else {
			throw new Error('plugin must be a function');
		}
	}

}

export default Server;
