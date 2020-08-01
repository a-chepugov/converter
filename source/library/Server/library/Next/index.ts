type CB<ARGS extends any[], RESULT> = (...args: ARGS) => RESULT;

type Action<CB_ARGS extends any[], CB_RESULT, A_ARGS extends any[], A_RESULT> =
	(callback: CB<CB_ARGS, CB_RESULT>, ...args: A_ARGS) => A_RESULT;

export default class Next<CB_ARGS extends any[], CB_RESULT, A_ARGS extends any[], A_RESULT> {
	action: Action<CB_ARGS, CB_RESULT, A_ARGS, A_RESULT>;

	constructor(action: Action<CB_ARGS, CB_RESULT, A_ARGS, A_RESULT>) {
		this.action = action;
	}

	static of(...args: any[]) {
		return new Next((callback: CB<typeof args, any>) => callback(...args));
	}

	execute = (callback: CB<CB_ARGS, CB_RESULT>, ...args: A_ARGS) => {
		return this.action(callback, ...args);
	}

	next<CB_ARGS_2 extends any[]>(layer: (callback: CB<CB_ARGS_2, CB_RESULT>, ...args: CB_ARGS) => any) {
		return new Next((callback2: CB<CB_ARGS_2, CB_RESULT>, ...args1: A_ARGS) => {
			return this.action((...args2: CB_ARGS) => {
				return layer(callback2, ...args2);
			}, ...args1)
		});
	}

}
