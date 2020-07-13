import base from './base'
import ReadableStream = NodeJS.ReadableStream;

export class stream extends base<ReadableStream> {
	send = (payload: ReadableStream) => {
		return payload.pipe(this.response);
	}
}

export default stream;
