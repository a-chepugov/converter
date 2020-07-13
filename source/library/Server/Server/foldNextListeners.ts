import Next from "../library/Next";

import {Context, ContextListener} from "./Context";

export function foldNextListeners(listeners: Iterable<ContextListener>) {
	return Array
		.from(listeners)
		.reduce(
			(
				chain: Next<[Context, Promise<any>], Promise<any>, [Context, Promise<any>], Promise<any>>,
				listener: ContextListener
			) =>
				chain.next(
					(
						cb: (ctx: Context, promise: Promise<any>) => Promise<any>,
						ctx: Context,
						promise: Promise<any>
					) =>
						cb(
							ctx,
							promise
								.then((result: any) => {
									try {
										return listener(ctx, result);
									} catch (error) {
										throw error;
									}
								})
						)
				),
			new Next((cb: any, ctx: Context, initial?: any) => cb(ctx, Promise.resolve(initial)))
		)
}

export default foldNextListeners;
