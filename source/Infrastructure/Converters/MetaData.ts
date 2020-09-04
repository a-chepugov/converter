const {extname} = require('path');
import {spawn} from '../../library/Process'

import Meta from '../../Models/Meta';
import {Exiftool, Input, Tags} from '../../library/exiftool-wrapper';
import '../../library/Meta2Exiftool';

export class MetaDataError extends Error {
}

const allowedExtensions = ['.jpg', '.png'];

export class MetaData {
	static insert = (metaRaw: { [name: string]: string }) => (files: string[]) => {
		const options = Meta.from(metaRaw).toExiftoolOptions();

		const exifCommand = Exiftool
			.of(
				files
					.filter((file) => allowedExtensions.includes(extname(file)))
					.map((file) => Input.Globbing.of(file))
			)
			.with(new Tags.OverwriteOriginal())
			.append(options.options)

		return spawn.apply(null, exifCommand.build())
			.then(() => files, () => files)
	}

}

export default MetaData;
