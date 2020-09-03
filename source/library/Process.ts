const child_process = require('child_process');

export function spawn(command: string, ...parameters: string[]) {
	return new Promise((resolve, reject) => {
		try {
			const child = child_process.spawn(command, parameters);

			let reason = '';
			child.stderr.on('data', (data: Buffer) => reason += data.toString('utf8'));

			child.on('close', (code: number) =>
				code ?
					reject(Object.assign(new Error(reason), {code})) :
					resolve()
			)
		} catch (error) {
			reject(error);
		}

	});

}
