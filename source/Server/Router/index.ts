import {Router, Context} from '../../library/Server';
import * as Photos from '../Controllers/Photos';
import auxiliary from './auxiliary';

const parseJSON = (ctx: Context) => ctx.parse('json').catch((error: any) => Promise.reject(Object.assign(error, {
	reason: error.message,
	code: 400
})));

const router = new Router()
	.on('post', '/photos/convertByPresets', parseJSON, Photos.convertByPresets, Context.send('json'))
	.on('post', '/photos/convert', parseJSON, Photos.convert, Context.send('json'))

export default router.concat(auxiliary);
