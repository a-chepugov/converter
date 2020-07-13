import base from './base'
import ReadableStream = NodeJS.ReadableStream;

export class stringable extends base<ReadableStream> {
	send = (payload: ReadableStream) => {
		return this.response.end(payload.toString());
	}
}

export default stringable;
