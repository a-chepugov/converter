import {Context as ControllerContext} from "../Server/Controller";

export class Context extends ControllerContext {
	parameters: { [key: string]: string };

	static from(ctx: ControllerContext, parameters: { [key: string]: string }) {
		return Object.create(new Context(ctx), {parameters: {value: parameters}});
	}

}

export default Context;
