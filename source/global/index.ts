import "./logger";

declare global {
	interface Error {
		id?: number | string;
		code?: number | string;
		reason?: string;
	}
}

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	global.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
	process.exit(1);
});

process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception at:');
	console.error(error);
	global.logger.error('Uncaught Exception at:', error && error.message ? error.message : error);
	process.exit(1);
});
