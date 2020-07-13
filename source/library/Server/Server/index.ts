import * as http from 'http';

import {Listener, Context, ContextListener} from "./Listener";
import {IncomingMessage, ServerResponse} from "http";

export {Context, ContextListener} from "./Listener";

class ServerCore {
	protected readonly _listener: Listener;
	protected readonly _server: http.Server;

	constructor(listener: Listener) {
		Object.defineProperty(this, '_listener', {value: listener});
		Object.defineProperty(this, '_server', {value: http.createServer(this._listener.listen)});
	}

	interceptor = (interceptor: (ctx: Context, error: any) => void) => {
		this._listener.interceptor(interceptor);
		return this;
	}

	with = (setter: (request: IncomingMessage, response: ServerResponse) => any) => {
		this._listener.with(setter);
		return this;
	};

	use = (nextRequestListener: ContextListener) => {
		this._listener.register(nextRequestListener);
		return this;
	}

	unuse = (nextRequestListener: ContextListener) => {
		this._listener.unregister(nextRequestListener);
		return this;
	}

	get server() {
		return this._server;
	}
}

export class Server extends ServerCore {
	protected _port: number;
	protected _host: string;
	protected _backlog: number;

	constructor(listener: Listener) {
		super(listener);
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

	static create(listeners?: Iterable<ContextListener>) {
		const listener = new Listener(listeners);
		return new Server(listener);
	}

	start = (callback?: () => void) => {
		this._server.listen(this._port, this._host, this._backlog, callback);
		return this;
	}
}

export default Server;
