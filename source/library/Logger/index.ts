export interface Logger {
	info(...messages: any[]): any;
	warn(...messages: any[]): any;
	error(...messages: any[]): any;
}

export default Logger;
