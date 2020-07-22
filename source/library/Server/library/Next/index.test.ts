import {expect} from 'chai';
import Next from './index';

describe('Next', () => {

	it('can be constructed from function', () => {
		return new Next((cb: any, ...args: number[]) => cb(...args))
			.next((cb: any, ...args: number[]) => cb(...args.map((i: number) => i ** 2)))
			.execute((...args: number[]) => {
				return expect(args).to.be.deep.equal([1, 4, 9])
			}, 1, 2, 3);
	});

	it('can be constructed from primitives', () => {
		return Next.of(1, 2, 3)
			.next((cb: any, ...args: number[]) => cb(...args.map((i: any) => i ** 2)))
			.execute((...args: number[]) => {
				return expect(args).to.be.deep.equal([1, 4, 9])
			});
	});

	it('can run synchronously', () => {
		const result = Next.of(1, 2, 3)
			.next((cb: any, ...args: number[]) => cb(...args.map((i: number) => i ** 2)))
			.execute((...args: number[]) => args);

		expect(result).to.be.deep.equal([1, 4, 9])
	});

	it('can run asynchronously', (done) => {
		const result = Next.of(1, 2, 3)
			.next((cb: any, ...args: number[]) => setTimeout(() => cb(...args.map((i: any) => i ** 2))))
			.execute((...args: number[]) => {
				expect(args).to.be.deep.equal([1, 4, 9])
				expect(result).to.not.be.deep.equal(args)
				done();
			});
	});

	it('stays lazy until executed', () => {
		let counter = 0;

		const next = Next.of()
			.next((cb: any) => cb(counter++))
			.next((cb: any) => cb(counter++))
			.next((cb: any) => cb(counter++))

		expect(counter).to.be.equal(0)

		next.execute((...args: number[]) => args);
		expect(counter).to.be.equal(3)
	});

	it('unhandled error emerges after execute method invokes', () => {
		const next = Next.of()
			.next((_cb: any) => {
				throw new Error('Unhandled error');
			})

		expect(() => next.execute(() => undefined)).to.throw();
	});

});
