export type Property = { name: string, value: string }

export class Meta {
	properties: Property[];

	constructor() {
		this.properties = [];
	}

	add(property: Property) {
		this.properties.push(property);
		return this;
	}

	with(name: string, value: string) {
		this.properties.push({name, value});
		return this;
	}

	static of(properties?: Array<[string, string]>) {
		const meta = new Meta();

		if (Array.isArray(properties)) {
			properties.forEach(([name, value] = ['', '']) => meta.with(name, value));
		}

		return meta;
	}
}

export default Meta;
