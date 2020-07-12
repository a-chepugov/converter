export class Profiler<T extends number | bigint> {
	protected readonly label: string;
	protected _meter: () => T;

	constructor(label = '') {
		this.label = label;
	}

	static factory(meter: () => number | bigint = Date.now) {
		return class Factory {
			static of(label = '') {
				return new Profiler(label).configure(meter);
			}
		}
	}

	configure(meter: () => T): any {
		if (typeof meter === 'function') {
			return new ProfilerConfigured(this.label, meter);
		} else {
			throw new Error(`${this.label} profiler is supplied with meter which is not a function`);
		}
	}

	start = (postfix = ''): any => {
		throw new Error(`${this.label} profiler meter hasn't been configured yet`);
	}

	end = (postfix = ''): any => {
		throw new Error(`${this.label} profiler hasn't been started yet`);
	}

	get configured() {
		return false;
	}

	get started() {
		return false;
	}

	get ended() {
		return false;
	}

	get result(): any {
		throw new Error(`${this.label} profiler hasn't collect enough data`);
	}
}

class ProfilerConfigured<T extends number | bigint> extends Profiler<T> {
	constructor(label: string, meter: () => T) {
		super(label);
		this._meter = meter;
	}

	configure(meter: () => T) {
		throw new Error(`${this.label} profiler has been configured already`);
	}

	start = (postfix = '') => {
		return new ProfilerStarted(this.label + postfix, this._meter, this._meter());
	}

	get configured() {
		return true;
	}

}

class ProfilerStarted<T extends number | bigint> extends ProfilerConfigured<T> {
	protected startedAt: T;

	constructor(label: string, meter: () => T, _startedAt: T) {
		super(label, meter);
		this.startedAt = _startedAt;
	}

	start = (postfix = '') => {
		throw new Error(`${this.label} profiler has been already started`);
	}

	end = (postfix = '') => {
		return new ProfilerEnded(this.label + postfix, this._meter, this.startedAt, this._meter());
	}

	get started() {
		return true;
	}
}

class ProfilerEnded<T extends number | bigint> extends ProfilerStarted<T> {
	protected endedAt: T;

	constructor(label: string, meter: () => T, _startedAt: T, _endedAt: T) {
		super(label, meter, _startedAt);
		this.endedAt = _endedAt;
	}

	end = (postfix = '') => {
		throw new Error(`${this.label} profiler has been already ended`);
	}

	get ended() {
		return true;
	}

	get result() {
		return this.endedAt - this.startedAt;
	}
}

export default Profiler;
