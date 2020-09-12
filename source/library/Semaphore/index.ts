export default class Semaphore {
	private readonly concurrency: number;
	private queue: Array<Function>;
	private counter: number;

	constructor(concurrency = 1) {
		this.concurrency = concurrency;
		this.queue = new Array<Function>();
		this.counter = 0;
	}

	/**
	 * @description Takes semaphore lock
	 * @returns {Promise<Boolean>} - show was promise resolved immediately or deferred
	 */
	enter(): Promise<Boolean> {
		return new Promise((resolve) => {
			if (this.counter < this.concurrency) {
				this.counter++;
				resolve(true);
			} else {
				this.queue.push(resolve);
			}
		});
	}

	/**
	 * @description Releases semaphore lock
	 */
	leave(): void | never {
		if (this.queue.length === 0) {
			if (this.counter > 0) {
				this.counter--;
			} else {
				throw new Error('Semaphore has been leaved too many times');
			}
		} else {
			const resolve = this.queue.shift() as Function;
			resolve(false);
		}
	}
}
