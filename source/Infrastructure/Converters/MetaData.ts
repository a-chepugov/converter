const {extname} = require('path');
import {spawn} from '../../library/Process'

import Image from '../../Models/Image';
import Meta from '../../Models/Meta';
import {Exiftool, Input, Tags} from '../../library/exiftool-wrapper';
import '../../library/Meta2Exiftool';

const MAX_DURATION = 120000;

const allowedExtensions = ['.jpg', '.png'];

export class MetaData {
	static insert = (metaRaw: { [name: string]: string }) => (images: Image[]) => {
		const options = Meta.from(metaRaw).toExiftoolOptions();

		const exifCommand = Exiftool
			.of(
				images
					.filter((file) => allowedExtensions.includes(extname(file.fullname)))
					.map((file) => Input.Globbing.of(file.fullname))
			)
			.with(new Tags.OverwriteOriginal())
			.append(options.options)

		return new Promise((resolve, reject) => {
				let finished = false;
				const process = spawn(exifCommand.build(), (error) => {
					if (finished) return;
					finished = true;
					error ? reject(error) : resolve(undefined);
				});

				setTimeout(() => {
					if (finished) return;
					finished = true;
					process.kill(9);
					reject(new Error('exiftool stuck'));
				}, MAX_DURATION)
			}
		)
	}

}

export default MetaData;
