import { createConsola, type LogObject } from "consola";
import { Store } from "@tanstack/solid-store";

export const logStore = new Store<LogObject[]>([]);

export const logger = createConsola({
	reporters: [
		{
			log: (log) => {
				logStore.setState((prev) => [...prev, log]);
			},
		},
	],
});
