export interface Parse<T> {
	parse(sender: any): T;
}

export interface ParseConstructor<T> {
	new(...args: any[]): Parse<T>;
}

export default Parse;
