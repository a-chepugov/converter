import * as path from 'path';

const upSymbol = /\.\./;

export const isOutsideOf = (containerDirPath: string, targetDirPath: string) => {
	containerDirPath = path.normalize(containerDirPath);
	targetDirPath = path.normalize(targetDirPath);
	return path.normalize(path.relative(containerDirPath, targetDirPath)).startsWith('..');
}

export const isTheSame = (containerDirPath: string, targetDirPath: string) => {
	containerDirPath = path.normalize(containerDirPath);
	targetDirPath = path.normalize(targetDirPath);
	return path.normalize(path.relative(containerDirPath, targetDirPath)) === '.';
}

export const triedToRise = (targetDirPath: string) => {
	return targetDirPath.search(upSymbol) > -1;
}
