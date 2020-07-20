import {Server, Context} from '../library/Server';

import {State} from './library/State';
import interceptor from './library/interceptor';
import router from './Router';

const PORT = 3000;
const HOST = 'localhost';

declare module "../library/Server" {
	interface Context {
		q: any;
	}
}

function q(constructor: any) {
	constructor.prototype.q = 1;
}

Server
	.context(q)
	.create()
	.state(State.of)
	.use(router.listen)
	.interceptor(interceptor)
	.on(HOST, PORT)
	.start(() => console.info(`Server started on http://${HOST}:${PORT}`))
