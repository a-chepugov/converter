import {IncomingMessage, ServerResponse} from "http";

import Context from './Context'

export type RequestListener = (request: IncomingMessage, response: ServerResponse) => void;

export type NextRequestListener = (ctx: Context, result: any) => any;
