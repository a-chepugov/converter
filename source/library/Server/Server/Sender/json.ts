import base from './base'

export class json extends base<Object> {
	send = (payload: Object) => {
		const result = JSON.stringify(payload);
		this.response.setHeader('Content-Type', 'application/json');
		return this.response.end(result);
	}
}

export default json;
