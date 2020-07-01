import {Area as AreaPresets} from '../Models/Preset';

export const Presets = {
	auto: {
		photo: {parameters: require('./auto/photo').default} as AreaPresets,
	},
};

export default Presets;

export function byArea(area: string[]): AreaPresets {
	return byAreaFromStorage(area, Presets);
}

export function byAreaFromStorage(area: string[], presets: any): AreaPresets {
	if (area.length) {
		return byAreaFromStorage(area.slice(1), presets[area[0]]);
	} else {
		if (presets && presets.parameters) {
			return presets;
		} else {
			throw new Error('Invalid preset');
		}
	}
}
