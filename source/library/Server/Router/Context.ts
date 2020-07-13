import {Context as ListenerContext} from "../Server/Listener";

export class Context extends ListenerContext {
	parameters: { [key: string]: string };

	static from(ctx: ListenerContext, parameters: { [key: string]: string }) {
		return Object.create(new Context(ctx), {parameters: {value: parameters}});
	}

}

export default Context;
