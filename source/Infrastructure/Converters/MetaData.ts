const {spawn} = require('child_process');

import Meta from '../../Models/Meta';

export class MetaDataError extends Error {
}

export class MetaData {
	static buildEXIFCommandFromMeta(meta: Meta, files: string[]): {build:() => string} {
		return {
			build: () => ''
		}
	}


	static insert = (meta: Meta) => (files: string[]) => {
		console.log('DEBUG:MetaData.ts():9 =>', meta);
		const exifcommand = MetaData.buildEXIFCommandFromMeta(meta, files);

		console.log('DEBUG:MetaData.ts(m):20 =>', exifcommand);

		return new Promise((resolve, reject) => {
			resolve(files);
			return;
			try {
				const [command, ...parameters] = exifcommand.build();
				const child = spawn(command, parameters);

				let reason = '';
				child.stderr.on('data', (data: Buffer) => reason += data.toString('utf8'));
				child.on('close', (code: number) =>
					code ?
						reject(Object.assign(new MetaDataError(`${JSON.stringify({files, meta})}. ${reason}`), {code})) :
						resolve(files)
				)
			} catch (error) {
				reject(error);
			}

			resolve(files);
		});
	}

}

export default MetaData
