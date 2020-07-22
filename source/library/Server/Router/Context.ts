import {Context} from "../Server/Controller";

declare module "../Server/Controller" {
	interface Context {
		parameters: { [key: string]: string };
	}
}
