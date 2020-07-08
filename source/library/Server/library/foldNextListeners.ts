import Next from "./Next";

import {NextRequestListener} from "./RequestListener";
import Context from "./Context";

export function foldNextListeners(listeners: Iterable<NextRequestListener>): NextRequestListener {
	return (ctx: Context, initial: any) => {
		return Array
			.from(listeners)
			.reduce(
				(chain: Next<[Promise<any>], Promise<any>, Promise<any>[], Promise<any>>, listener: NextRequestListener) =>
					chain.next((cb: (promise: Promise<any>) => Promise<any>, promise: Promise<any>) =>
						cb(promise
							.then((result: any) => {
								try {
									return listener(ctx, result);
								} catch (error) {
									throw error;
								}
							})
						)
					),
				Next.of(Promise.resolve(initial))
			)
			.execute((promise: Promise<any>): Promise<any> => promise)
	}
}

export default foldNextListeners;
