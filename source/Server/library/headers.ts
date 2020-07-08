import {Context} from '../../library/Server';

export const XCompletedIn = (ctx: Context, fn: any) => {
	const start = Date.now();
	return new Promise((resolve, reject) => {
		try {
			resolve(fn());
		} catch (error) {
			reject(error);
		}
	})
		.then((response) => {
			const duration = Date.now() - start;
			ctx.response.setHeader('X-COMPLETED-IN', duration);
			return response;
		})
		.catch((error) => {
			const duration = Date.now() - start;
			ctx.response.setHeader('X-COMPLETED-IN', duration);
			throw error;
		})
}
