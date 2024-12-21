import { ReactiveMap } from "@solid-primitives/map";
import { batch } from "solid-js";
import { type SetStoreFunction, createStore, reconcile } from "solid-js/store";
import { areUint8ArraysEqual, hexToUint8Array } from "uint8array-extras";
import { logger } from "../logger";
import { Block } from "./block";
import { Transaction } from "./transaction";
import type { Wallet } from "./wallet";

export interface BlockchainSettings {
	difficulty: number;
	baseReward: number;
}

export interface BlockchainState {
	blocks: Block[];
	settings: BlockchainSettings;
	mempool: Transaction[];
}

export class Blockchain {
	store: BlockchainState;
	setStore: SetStoreFunction<BlockchainState>;
	wallets: ReactiveMap<string, Wallet>;

	constructor(initial: BlockchainState) {
		[this.store, this.setStore] = createStore(initial);
		this.wallets = new ReactiveMap();
	}

	/**
	 * Creates the genesis block when there are no other nodes in the network.
	 */
	async createGenesisBlock(wallet: Wallet) {
		if (this.store.blocks.length !== 0) {
			throw new Error("Genesis block already exists");
		}

		const transaction = new Transaction(
			hexToUint8Array(
				// pssst, there is a secret message here
				"6d6f6e65792067726f7773206f6e20746865206d65726b6c652074726565b42a552a010675e0ee6b612e74c73f0af04009ab295772092822b541ac1d34b2a5e0fa",
			),
			wallet.raw.public,
			1000,
			Date.now(),
		);

		const block = new Block(
			0,
			Date.now(),
			new Uint8Array([]),
			new Uint8Array([]),
			0,
			wallet.raw.public,
			[transaction],
		);

		block.hash = await block.calculateHash();

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
		if (!areUint8ArraysEqual(block.previousHash, previousBlock.hash)) {
			throw new Error("Invalid previousHash");
		}
		if (block.hash !== (await block.calculateHash())) {
			throw new Error("Invalid block hash");
		}
		if (!block.satisfiesDifficulty(this.store.settings.difficulty)) {
			throw new Error("Block does not meet difficulty requirements");
		}

		for (const transaction of block.transactions) {
			if (this.getBalance(transaction.sender) < transaction.amount) {
				throw new Error("Insufficient funds");
			}
		}

		batch(() => {
			this.setStore("blocks", this.store.blocks.length, block);
			this.setStore(
				"mempool",
				reconcile(
					this.store.mempool.filter(
						(transaction) =>
							!block.transactions
								.map((t) => t.timestamp)
								.includes(transaction.timestamp),
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

	/**
	 * Validate the entire blockchain.
	 */
	static async validate(blocks: Block[]) {
		for (let i = 1; i < blocks.length; i++) {
			const block = blocks[i];
			const previousBlock = blocks[i - 1];

			if (block.previousHash !== previousBlock.hash) return false;

			if (block.hash !== (await block.calculateHash())) return false;
		}
		logger.info("validated blockchain integrity");
		return true;
	}

	/**
	 * Returns the balance of a given address.
	 */
	getBalance(address: Uint8Array) {
		const fromMining =
			this.store.blocks.reduce(
				(acc, block) =>
					areUint8ArraysEqual(block.minedBy, address) ? acc + 1 : acc,
				0,
			) * this.store.settings.baseReward;

		const fromTransactions = this.store.blocks
			.flatMap((block) => block.transactions)
			.reduce((acc, transaction) => {
				if (areUint8ArraysEqual(transaction.sender, address))
					return acc - transaction.amount;
				if (areUint8ArraysEqual(transaction.recipient, address))
					return acc + transaction.amount;
				return acc;
			}, 0);
		return fromTransactions + fromMining;
	}
}
