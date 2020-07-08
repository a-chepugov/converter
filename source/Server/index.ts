import Server, {Context} from '../library/Server';
import router from './Router';

import {STATUS_CODES} from "http";

const PORT = 3000;
const HOST = 'localhost';

const interseptor = (ctx: Context, error: any) => {
	if (!ctx.response.finished) {
		ctx.response.statusCode = error?.code ? error.code : 500;
		ctx.response.end(error?.message ? error.message : STATUS_CODES[ctx.response.statusCode]);
	}
	console.error(error, `: ${ctx.request.url}`);
	global.logger.error((error?.internal ? error.internal : error?.message ? error.message : error), `: ${ctx.request.url}`);
}

new Server()
	.port(PORT)
	.host(HOST)
	.interseptor(interseptor)
	.use(router.listen)
	.init(() => console.info(`Server started at http://${HOST}:${PORT}`))
