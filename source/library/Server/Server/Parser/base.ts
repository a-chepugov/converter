import {IncomingMessage} from "http";
import {Parse} from "./interface";
import {toString} from "../../library/Stream";

export class base implements Parse<Promise<string>> {
	parse(source: IncomingMessage): Promise<string> {
		return toString(source);
	};
}

export default base;
