export interface Send<T> {
	send(payload: T): any;
}

export interface SendConstructor<T> {
	new(...args: any[]): Send<T>;
}

export default Send;
