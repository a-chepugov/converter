import {IncomingMessage, ServerResponse} from "http";

import Context from './Context'

export type RequestListener = (request: IncomingMessage, response: ServerResponse) => void;

export type ContextListener = (ctx: Context, result: any) => any;
