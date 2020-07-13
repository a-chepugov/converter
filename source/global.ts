import FileLogger, {Logger} from "./library/Logger/FileLogger";

declare global {
	module NodeJS {
		interface Global {
			logger: Logger;
		}
	}
}

global.logger = new FileLogger(`./logs`);

process
	.on('unhandledRejection', (reason, promise) => {
		console.error('Unhandled Rejection at:', promise, 'reason:', reason);
		global.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
	});

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
