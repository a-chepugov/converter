import * as http from 'http';

import {RequestListener, Controller, Context, ContextListener} from "./Controller";
import {IncomingMessage, ServerResponse} from "http";

export {Context, ContextListener} from "./Controller";

class ServerCore {
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
	protected readonly listener: Controller;

	constructor(listener: Controller) {
		super(listener.listen);
		this.listener = listener;
	}

	static create(listeners?: Iterable<ContextListener>) {
		const listener = new Controller(listeners);
		return new Server(listener);
	}

	interceptor = (interceptor: (ctx: Context, error: any) => void) => {
		this.listener.interceptor(interceptor);
		return this;
	}

	with = (setter: (request: IncomingMessage, response: ServerResponse) => any) => {
		this.listener.with(setter);
		return this;
	};

	use = (nextRequestListener: ContextListener) => {
		this.listener.register(nextRequestListener);
		return this;
	}

	unuse = (nextRequestListener: ContextListener) => {
		this.listener.unregister(nextRequestListener);
		return this;
	}
}

export default Server;
