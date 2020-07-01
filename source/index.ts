const {spawn} = require('child_process');
import {Input, Output, Convert} from 'imagemagick-cli-wrapper';

import * as Presets from './Presets';
import {Image as ImagePreset} from './Models/Preset';
import * as fromPreset from './Presets/fromPreset';

import './library/IM/ImageToIMOperations';

function buildConvertByPresets(input: string, output: string, presetsOutput: string, presets: ImagePreset[]) {
	const conversion = Convert
		.of(new Input.Globbing(input))
		.into(new Output.Filename(output))

	return presetsOutput && Array.isArray(presets) ?
		presets.reduce((conversion: Convert, preset: ImagePreset) => {
			const image = fromPreset.toImage(preset, './static/');
			const params = image.toIMOperations(presetsOutput);
			return conversion.fork(params);
		}, conversion) :
		conversion
}


async function index(area: string[]) {
	const filename = `./output/1`;

	const presets = Presets.byArea(area);

	const convert = buildConvertByPresets('./input/1.jpg', `${filename}.jpg`, filename, Object.values(presets.parameters));

	const [command, ...parameters] = convert.build();

	const child = spawn(command, parameters);

	child.stderr.on('data', (data: Buffer) => {
		console.error(data.toString('utf8'));
		child.kill(9);
	});

	return new Promise((resolve, reject) => child.on('close', (code: number) => code ? reject(code) : resolve(code)));
}

index(['auto', 'photo'])
	.then((response) => {
		console.log('DEBUG:index(index):39 =====>');
		console.dir(response, {colors: true, depth: null});
		console.log('DEBUG:index(index):41 ===>');
		return response;
	})
	.catch((error) => {
		console.error('DEBUG:index(index):45 =====>');
		console.error(error);
		console.error('DEBUG:index(index):47 ===>');
		throw error;
	})

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
