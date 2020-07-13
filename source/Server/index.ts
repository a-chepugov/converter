import Server, {Context} from '../library/Server';
import {generate} from '../library/HEX';
import router from './Router';

import {IncomingMessage, STATUS_CODES} from "http";

const PORT = 3000;
const HOST = 'localhost';

const interceptor = (ctx: Context, error: any) => {
	if (!ctx.response.finished) {
		ctx.response.statusCode = error?.code ? error.code : 500;
		ctx.response.end(error?.message ? error.message : STATUS_CODES[ctx.response.statusCode]);
	}
	if (error?.internal) {
		error.internal = `[${ctx.state.id}] ` + error.internal;
	} else if (error?.message) {
		error.message = `[${ctx.state.id}] ` + error.message;
	}

	console.error(error, `: ${ctx.request.url}`);
	global.logger.error((error?.internal ? error.internal : error?.message ? error.message : error), `: ${ctx.request.url}`);
}

const setter = (request: IncomingMessage) => {
	const requestId = request.headers['request-id'];
	const id = Array.isArray(requestId) ? requestId[0] : requestId ? requestId : generate(36);
	return {id};
}

Server
	.on(HOST, PORT)
	.with(setter)
	.use(router.listen)
	.interceptor(interceptor)
	.init(() => console.info(`Server started on http://${HOST}:${PORT}`))
