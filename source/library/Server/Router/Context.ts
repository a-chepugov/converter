import {Context} from "../Server/Controller";

export type Parameters = { [key: string]: string };

declare module "../Server/Controller" {
	interface Context {
		parameters: Parameters;
	}
}
