import {Server} from '../library/Server';

import {State} from './library/State';
import interceptor from './library/interceptor';
import router from './Router';

const HOST = 'localhost';
const PORT = 3000;

Server
	.create()
	.state(State.of)
	.use(router.listen)
	.interceptor(interceptor)
	.on(HOST, PORT)
	.start(() => console.info(`Server started on http://${HOST}:${PORT}`))
