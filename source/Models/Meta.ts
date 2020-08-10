export type Property = [string, string]

export class Meta {
	properties: Map<string, string>;

	constructor(properties?: Iterable<Property>) {
		this.properties = new Map(properties);
	}

	add(property: Property) {
		this.properties.set(property[0], property[1]);
		return this;
	}

	with(name: string, value: string) {
		this.properties.set(name, value);
		return this;
	}

	has(name: string) {
		return this.properties.has(name);
	}

	get(name: string) {
		return this.properties.get(name);
	}

	static from(source: { [name: string]: string }) {
		const meta = new Meta();
		for (let key in source) {
			meta.with(key, source[key]);
		}
		return meta;
	}
}

export default Meta;
