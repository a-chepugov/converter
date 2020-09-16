const child_process = require('child_process');

export function spawn([command, ...parameters]: string[], cb: (error?: Error) => any) {
	try {
		const child = child_process.spawn(command, parameters);

		let error = '';
		child.stderr.on('data', (data: Buffer) => error += data.toString('utf8'));

		child.on('close', (code: number) =>
			code ?
				cb(Object.assign(new Error(error), {code})) :
				cb()
		);

		return {kill: child.kill.bind(child)};
	} catch (error) {
		cb(error);
	}
}
