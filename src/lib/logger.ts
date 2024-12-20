import { Store } from "@tanstack/solid-store";
import { type LogObject, createConsola } from "consola";

export const logStore = new Store<LogObject[]>([]);

export const logger = createConsola({
	level: Number.POSITIVE_INFINITY,
	reporters: [
		{
			log: (log) => {
				logStore.setState((prev) => [...prev, log]);
			},
		},
	],
});
