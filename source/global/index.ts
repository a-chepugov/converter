import "./logger";

declare global {
	interface Error {
		code: number;
		internal: string;
		obscure: (message: string) => this;
	}
}

Error.prototype.obscure = function (message: string) {
	this.internal = this.message;
	this.message = message;
	return this;
}

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	global.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
