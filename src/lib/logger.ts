import { Store } from "@tanstack/solid-store";

enum LogLevel {
	INFO = "info",
	WARN = "warn",
	ERROR = "error",
}

export interface Log {
	level: LogLevel;
	message: string;
}

export const logStore = new Store<Log[]>([]);

function addLog(level: LogLevel) {
	return (message: string) => {
		logStore.setState((prev) => [...prev, { level, message }]);
	};
}

export const logger = {
	info: addLog(LogLevel.INFO),
	warn: addLog(LogLevel.WARN),
	error: addLog(LogLevel.ERROR),
};
