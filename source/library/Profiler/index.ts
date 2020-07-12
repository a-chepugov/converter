export class Profiler<T extends number | bigint> {
	private readonly label: string;
	private _startedAt: T;
	private _endedAt: T;
	private _meter: () => T;

	constructor(label?: string) {
		this.label = label;
	}

	static factory(meter: () => number | bigint = Date.now) {
		return class ProfilerConfigured extends Profiler<ReturnType<typeof meter>> {
			constructor(label?: string) {
				super(label);
				this.meter(meter);
			}

			static of(label?: string) {
				return new ProfilerConfigured(label).start();
			}
		}
	}

	static of(label?: string) {
		return new Profiler(label).start();
	}

	meter(meter: () => T) {
		if(this._meter)

		if (typeof meter === 'function') {
			this._meter = meter;
		} else {
			throw new Error(`${this.label} profiler is supplied with meter which is not a function`);
		}
		return this;
	}

	start = () => {
		if (this.started) {
			throw new Error(`${this.label} profiler has been already started`);
		}
		if (typeof this._meter === 'function') {
			this._startedAt = this._meter();
		} else {
			throw new Error(`${this.label} profiler meter hasn't been selected yet`);
		}
		return this;
	}

	end = () => {
		if (this.ended) {
			throw new Error(`${this.label} profiler has been already ended`);
		}
		if (typeof this._meter === 'function') {
			this._endedAt = this._meter();
		} else {
			throw new Error(`${this.label} profiler meter hasn't been selected yet`);
		}
		return this;
	}

	get started() {
		return Boolean(this._startedAt);
	}

	get ended() {
		return Boolean(this._endedAt);
	}

	get result() {
		if (this.started && this.ended) {
			return this._endedAt - this._startedAt;
		} else {
			throw new Error(`${this.label} profiler hasn't collect enough data`);
		}
	}
}

export default Profiler;
