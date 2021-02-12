const {extname} = require('path');
import {spawn} from '../../library/Process'

import Image from '../../Models/Image';
import Meta from '../../Models/Meta';
import {Exiftool, Input, Tags} from '../../library/exiftool-wrapper';
import '../../library/Meta2Exiftool';

const MAX_DURATION = 120000;

const allowedExtensions = ['.jpeg', '.jpg', '.png'];

export class MetaData {
	static insert = (images: Image[]) => {
		return Promise
			.resolve(images)
			.then((images) => images
				.filter((image) => image.meta)
				.filter((image) => allowedExtensions.includes(extname(image.fullname)))
				.map((image) => Exiftool
					.of([Input.Globbing.of(image.fullname)])
					.with(new Tags.OverwriteOriginal())
					.append(image.meta.toExiftoolOptions().options)
				))
			.then((exiftoolCommands) => exiftoolCommands
				.map((exifCommand) => new Promise((resolve, reject) => {
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
							reject(new Error(`exiftool stuck: ${exifCommand.inspect()}`));
						}, MAX_DURATION)
					})
				))
			.then((response) => Promise.allSettled(response))
	}

}

export default MetaData;
