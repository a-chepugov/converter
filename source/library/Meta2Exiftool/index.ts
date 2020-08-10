import Meta from '../../Models/Meta';
import {Options, Tags} from '../exiftool-wrapper';


declare module '../../Models/Meta' {
	interface Meta {
		toExiftoolOptions(): Options.Options;
	}
}

Meta.prototype.toExiftoolOptions = function () {
	const options = new Options.Options()

	const properties = this.properties;

	if (properties.has('Artist')) {
		const value = properties.get('Artist');
		options.push(new Tags.Artist(value));
	}
	if (properties.has('Copyright')) {
		const value = properties.get('Copyright');
		options
			.push(new Tags.Copyright(value))
			.push(new Tags.Rights(value))
	}
	if (properties.has('Description')) {
		const value = properties.get('Description');
		options
			.push(new Tags.ImageDescription(value))
			.push(new Tags.XMP('description', value))
	}


	return options;
}
