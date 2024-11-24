import {
	type SetStoreFunction,
	createStore,
	reconcile,
} from "solid-js/store";
import { Block } from "./block";
import { Transaction } from "./transaction";
import { batch } from "solid-js";

export interface BlockchainSettings {
	difficulty: number;
}

export interface BlockchainState {
	blocks: Block[];
	settings: BlockchainSettings;
	mempool: Transaction[];
}

export class Blockchain {
	store: BlockchainState;
	setStore: SetStoreFunction<BlockchainState>;

	constructor(initial: BlockchainState) {
		[this.store, this.setStore] = createStore(initial);
	}

	/**
	 * Creates the genesis block when there are no other nodes in the network.
	 */
	async createGenesisBlock(selfId: string) {
		if (this.store.blocks.length !== 0) {
			throw new Error("Genesis block already exists");
		}

		const block = new Block(0, Date.now(), "", "", 0, [
			new Transaction("Creator", selfId, 1000),
		]);

		await block.mine(this.store.settings.difficulty);

		this.setStore("blocks", 0, block);
	}

	/**
	 * Adds a block to the blockchain after verifying it is correct.
	 */
	async appendBlock(block: Block) {
		if (this.store.blocks.length === 0) {
			throw new Error("There is no genesis block");
		}

		const previousBlock = this.store.blocks.at(-1)!;
		if (previousBlock.hash !== block.previousHash) {
			throw new Error("Invalid previousHash");
		}
		if (block.hash !== (await block.calculateHash())) {
			throw new Error("Invalid block hash");
		}

		batch(() => {
			this.setStore("blocks", this.store.blocks.length, block);
			this.setStore(
				"mempool",
				reconcile(
					this.store.mempool.filter(
						(transaction) => !block.transactions.includes(transaction),
					),
				),
			);
		});
	}

	/**
	 * adds a transaction to the node's mempool.
	 */
	addTransaction(transaction: Transaction) {
		this.setStore("mempool", this.store.mempool.length, transaction);
	}
}
