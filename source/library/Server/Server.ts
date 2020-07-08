import * as http from 'http';

import {NextRequestListener} from "./library/RequestListener";
import Listener from "./library/Listener";
import Context from "./library/Context";

export class Server {
	public readonly server: http.Server;
	protected listener: Listener;
	protected _port: number;
	protected _host: string;
	protected _backlog: number;

	constructor() {
		this.listener = new Listener();
		this.server = http.createServer(this.listener.listen);
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
		this.server.listen(this._port, this._host, this._backlog, callback);
		return this;
	}
}

export default Server;
