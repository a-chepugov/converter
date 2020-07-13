import {Router} from '../../library/Server';

const {name, version, description} = require('../../../package.json');

const start = Date.now();

const router = new Router()
	.on('get', '/', () => ({name, version, description}))
	.on('get', '/ping', () => 'pong')
	.on('get', '/ping/:pong', (ctx) => ctx.parameters.pong)
	.on('get', '/uptime', () => (Date.now() - start))
	.on('get', '/favicon.ico', () => Promise.reject(Object.assign(new Error(), {code: 421})))

export default router;
