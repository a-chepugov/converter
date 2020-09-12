import {expect} from 'chai';
import Testee from './index';

describe('Semaphore', () => {

	it('tasks go in series with concurrency 1', async () => {
		const testee = new Testee(1);

		let i = 0;
		const sleepThenInc = (t: number) => new Promise((resolve, reject) => {
			setTimeout(() => (i++, resolve()), t)
		});

		const p1 = testee.enter()
			.then((isImmediateInvoke) => expect(isImmediateInvoke).to.be.equal(true))
			.then(() => sleepThenInc(100))
			.then(() => expect(i).to.be.equal(1))
			.then(testee.leave.bind(testee))
		;

		const p1_1 = Promise.resolve()
			.then(() => setTimeout(() => {
				expect(i).to.be.equal(1)
			}, 150))
		;

		const p2 = testee.enter()
			.then((isImmediateInvoke) => expect(isImmediateInvoke).to.be.equal(false))
			.then(() => sleepThenInc(100))
			.then(() => expect(i).to.be.equal(2))
			.then(testee.leave.bind(testee))
		;

		return Promise.all([p1, p1_1, p2])
	});

	it('25 tasks with concurrency 5 go into 5 bunches', () => {
		const AMOUNT = 25;
		const CONCURRENCY = 5;
		const TIMEOUT = 50;

		const testee = new Testee(CONCURRENCY);

		const sleep = (t: number) => new Promise((resolve, _reject) => setTimeout(() => resolve(), t));

		const promises = Array.from(new Array(AMOUNT), () =>
				testee.enter()
					.then(sleep.bind(this, TIMEOUT))
					.then(testee.leave.bind(testee))
			)
		;

		const start = Date.now();
		return Promise.all(promises)
			.then(() => {
				const finish = Date.now();
				expect(finish - start).to.be.gte(TIMEOUT * AMOUNT / CONCURRENCY);
			})
	});

	it('throws an error on too many leaves', () => {
		const testee = new Testee(1);

		const run = () => ({});

		return testee.enter()
			.then((immediate) => expect(immediate).to.be.equal(true))
			.then(run)
			.then(testee.leave.bind(testee))
			.then(() => {
				expect(() => testee.leave()).to.throw;
			})
	});

});
