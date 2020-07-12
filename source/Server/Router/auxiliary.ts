import {Router} from '../../library/Server';

const packageJson = require('../../../package.json');

const start = Date.now();

const router = new Router()
	.on('get', '/', (ctx) => ctx.json({
		name: packageJson.name,
		version: packageJson.version,
		description: packageJson.description
	}))
	.on('get', '/ping', (ctx) => (ctx.send('pong')))
	.on('get', '/uptime', (ctx) => (ctx.send((Date.now() - start))))
	.on('get', '/favicon.ico', () => Promise.reject(Object.assign(new Error(), {code: 421})))

export default router;
