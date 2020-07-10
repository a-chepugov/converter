import {Router} from '../../library/Server';
import * as Photos from '../Controllers/Photos';
import auxiliary from './auxiliary';

const router = new Router()
	.on('post', '/photos/convert', Photos.convert)

export default router.concat(auxiliary);
