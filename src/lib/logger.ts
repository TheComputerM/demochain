import { Store } from "@tanstack/solid-store";
import { type LogObject, createConsola } from "consola";
import { toaster } from "~/components/toaster";

export const logStore = new Store<LogObject[]>([]);

export const logger = createConsola({
	level: Number.POSITIVE_INFINITY,
	reporters: [
		{
			log: (log) => {
				if (log.level <= 3) {
					toaster.create({ title: log.type, description: log.args.join("\n") });
				}

				logStore.setState((prev) => [...prev, log]);
			},
		},
	],
});

export class LogError extends Error {
	constructor(message: string) {
		logger.error(message);
		super(message);
	}
}
