import "./logger";

declare global {
	interface Error {
		code?: number | string;
		reason?: string;
	}
}

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	global.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
	const heapdump = require('heapdump');
	heapdump.writeSnapshot('./logs/' + (new Date()).toISOString() + '.heapsnapshot', (error: any, filename: string) => {
		if (error) {
			console.error(error);
		}
		console.info('heapdump written to', filename);
		process.exit(1);
	})
});
