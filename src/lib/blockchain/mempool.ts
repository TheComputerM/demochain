import { Store } from "@tanstack/solid-store";
import type { Transaction } from "./transaction";

export const mempoolStore = new Store<Transaction[]>([]);

/**
 * Adds a transaction to the node's mempool.
 */
export const addTransaction = (transaction: Transaction) => {
	mempoolStore.setState((prev) => [...prev, transaction]);
};
