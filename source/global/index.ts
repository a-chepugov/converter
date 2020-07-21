import "./logger";

declare global {
	interface Error {
		code: number;
		reason: string;
	}
}

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	global.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
