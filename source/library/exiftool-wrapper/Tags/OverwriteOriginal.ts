import Base from "./_Base";

export class OverwriteOriginal extends Base {
	build(): string[] {
		return ['-overwrite_original'];
	}
}

export default OverwriteOriginal;
