import * as http from 'http';

import {NextRequestListener} from "./RequestListener";
import Listener from "./Listener";
import Context from "./Context";
export {Context} from "./Context";

export class Server {
	protected listener: Listener;
	protected readonly _server: http.Server;
	protected _port: number;
	protected _host: string;
	protected _backlog: number;

	constructor(listeners?: Iterable<NextRequestListener>) {
		this.listener = new Listener(listeners);
		this._server = http.createServer(this.listener.listen);
	}

	get server() {
		return this._server;
	}

	host(host: string) {
		this._host = host;
		return this;
	}

	port(port: number) {
		this._port = port;
		return this;
	}

	backlog(backlog: number) {
		this._backlog = backlog;
		return this;
	}

	static on = (host = 'localhost', port = 80, backlog?: number) =>
		new Server()
			.host(host)
			.port(port)
			.backlog(backlog);

	interseptor(interseptor: (ctx: Context, error: any) => void) {
		this.listener.interceptor = interseptor;
		return this;
	}

	use = (nextRequestListener: NextRequestListener) => {
		this.listener.register(nextRequestListener);
		return this;
	}

	unuse = (nextRequestListener: NextRequestListener) => {
		this.listener.unregister(nextRequestListener);
		return this;
	}

	init = (callback?: () => void) => {
		this._server.listen(this._port, this._host, this._backlog, callback);
		Object.freeze(this);
		return this;
	}
}

export default Server;
