import { Store } from "@tanstack/solid-store";
import type { Transaction } from "./transaction";

export const mempool = new Store<Transaction[]>([]);

/**
 * Adds a transaction to the node's mempool.
 */
export const addTransaction = (transaction: Transaction) => {
  mempool.setState((prev) => [...prev, transaction]);
};