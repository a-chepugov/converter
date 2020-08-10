const {spawn} = require('child_process');

import Meta from '../../Models/Meta';
import {Exiftool, Input, Tags} from '../../library/exiftool-wrapper';
import '../../library/Meta2Exiftool';

export class MetaDataError extends Error {
}

export class MetaData {
	static insert = (metaRaw: { [name: string]: string }) => (files: string[]) => {
		const options = Meta.from(metaRaw).toExiftoolOptions();

		const exifCommand = Exiftool
			.of(files.map((file) => Input.Globbing.of(file)))
			.with(new Tags.OverwriteOriginal())
			.append(options.options)

		return new Promise((resolve, reject) => {
			try {
				const [command, ...parameters] = exifCommand.build();
				const child = spawn(command, parameters);

				let reason = '';
				child.stderr.on('data', (data: Buffer) => reason += data.toString('utf8'));
				child.on('close', (code: number) =>
					code ?
						reject(Object.assign(new MetaDataError(`${JSON.stringify({files, meta: metaRaw})}. ${reason}`), {code})) :
						resolve(files)
				)
			} catch (error) {
				reject(error);
			}

			resolve(files);
		});
	}

}

export default MetaData;
