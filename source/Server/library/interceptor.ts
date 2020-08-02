import {STATUS_CODES} from "http";

import {Context} from '../../library/Server';

export const interceptor = (ctx: Context, error: any) => {
	if (!ctx.response.finished) {
		ctx.response.statusCode = error && error.code ? error.code : 500;
		ctx.response.end(error && error.reason ? error.reason : STATUS_CODES[ctx.response.statusCode]);
	}

	if (error && error.message) {
		error.message = `[${ctx.state.id}] ${error.message}`;
	}

	console.error(error, `: ${ctx.request.url}`);
	global.logger.error((error && error.message ? error.message : error), `: ${ctx.request.url}`);
}

export default interceptor;
