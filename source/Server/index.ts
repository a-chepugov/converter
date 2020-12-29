import {Server} from '../library/Server';

import {State} from './library/State';
import interceptor from './library/interceptor';
import router from './Router';

const HOST = process.env.NODE_SERVER_HOST || '0.0.0.0';
const PORT = Number(process.env.NODE_SERVER_PORT) || 8080;

Server
	.create()
	.state(State.of)
	.use(router.listen)
	.interceptor(interceptor)
	.on(HOST, PORT)
	.start(() => console.info(`Server started on http://${HOST}:${PORT}`))
	.server
	.on('clientError', (error, socket) =>
		error.code === 'ECONNRESET' || !socket.writable ? undefined : socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
	)
