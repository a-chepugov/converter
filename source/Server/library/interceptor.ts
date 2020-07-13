import {STATUS_CODES} from "http";

import {Context} from '../../library/Server';

export const interceptor = (ctx: Context, error: any) => {
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

export default interceptor;
