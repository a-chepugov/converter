import * as path from 'path';

export const areSame = (first: string, second: string) => {
	return path.normalize(first) === path.normalize(second);
}

export const isSubDirectory = (parent: string, child: string) => {
	const relative = path.relative(parent, child);
	return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}

export const isOutsideOf = (containerDirPath: string, dirPath: string) => {
	containerDirPath = path.normalize(containerDirPath);
	dirPath = path.normalize(dirPath);
	return !(areSame(containerDirPath, dirPath) || isSubDirectory(containerDirPath, path.dirname(dirPath)));
}
