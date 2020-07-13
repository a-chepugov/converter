import Server from '../library/Server';

import {State} from './library/State';
import interceptor from './library/interceptor';
import router from './Router';

const PORT = 3000;
const HOST = 'localhost';

Server.create()
	.with(State.of)
	.use(router.listen)
	.interceptor(interceptor)
	.on(HOST, PORT)
	.start(() => console.info(`Server started on http://${HOST}:${PORT}`))
