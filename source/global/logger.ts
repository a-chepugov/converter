import FileLogger, {Logger} from "../library/Logger/FileLogger";

declare global {
	module NodeJS {
		interface Global {
			logger: Logger;
		}
	}
}

global.logger = new FileLogger(`./logs`);
