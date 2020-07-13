import {IncomingMessage} from "http";
import {Parse} from "./interface";
import {toJSON} from "../../library/Stream";

export class json implements Parse<Promise<Object>> {
	parse = (source: IncomingMessage) => {
		return toJSON(source);
	}
}

export default json;
