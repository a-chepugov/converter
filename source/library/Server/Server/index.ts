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
	protected readonly controller: Controller;

	private constructor(controller: Controller) {
		super(controller.listen);
		Object.defineProperty(this, 'controller', {value: controller});
	}

	static create(listeners?: Iterable<ContextListener>) {
		const listener = new Controller(listeners);
		return new Server(listener);
	}

	state = (setter: (request: http.IncomingMessage, response: http.ServerResponse) => any) => {
		this.controller.state(setter);
		return this;
	};

	interceptor = (interceptor: (ctx: Context, error: any) => void) => {
		this.controller.interceptor(interceptor);
		return this;
	}

	use = (nextRequestListener: ContextListener) => {
		this.controller.register(nextRequestListener);
		return this;
	}

	unuse = (nextRequestListener: ContextListener) => {
		this.controller.unregister(nextRequestListener);
		return this;
	}

	static install(plugin: (constructor: typeof Server.prototype.constructor) => void) {
		if (typeof plugin === 'function') {
			plugin(Server);
		} else {
			throw new Error('plugin must be a function');
		}
		return Server;
	}

	static controller(plugin: (constructor: typeof Controller.prototype.constructor) => void) {
		if (typeof plugin === 'function') {
			Controller.install(plugin);
		} else {
			throw new Error('plugin must be a function');
		}
		return Server;
	}

	static context(plugin: (constructor: typeof Context.prototype.constructor) => void) {
		if (typeof plugin === 'function') {
			Controller.context(plugin);
		} else {
			throw new Error('plugin must be a function');
		}
		return Server;
	}
}

export default Server;
