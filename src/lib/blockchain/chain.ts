import { ReactiveMap } from "@solid-primitives/map";
import { batch } from "solid-js";
import { type SetStoreFunction, createStore, reconcile } from "solid-js/store";
import {
	areUint8ArraysEqual,
	hexToUint8Array,
	uint8ArrayToHex,
} from "uint8array-extras";
import { logger } from "../logger";
import { Block } from "./block";
import { Transaction } from "./transaction";
import type { PrivateKey, PublicKey } from "./keys";

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
	peers: ReactiveMap<
		string,
		{
			publicKey: PublicKey;
		}
	>;

	constructor(initial: BlockchainState) {
		[this.store, this.setStore] = createStore(initial);
		this.peers = new ReactiveMap();
	}

	/**
	 * Creates the genesis block when there are no other nodes in the network.
	 */
	async createGenesisBlock(privateKey: PrivateKey, publicKey: PublicKey) {
		if (this.store.blocks.length !== 0) {
			throw new Error("Genesis block already exists");
		}

		const transaction = await Transaction.create({
			sender: hexToUint8Array(
				// pssst, there is a secret message here
				"6d6f6e65792067726f7773206f6e20746865206d65726b6c652074726565b42a552a010675e0ee6b612e74c73f0af04009ab295772092822b541ac1d34b2a5e0fa",
			),
			recipient: publicKey.key,
			amount: 1000,
		});
		await transaction.sign(privateKey);

		const block = await Block.create({
			index: 0,
			previousHash: new Uint8Array([]),
			minedBy: publicKey.key,
			transactions: [transaction],
		});
		await block.mine(this.store.settings.difficulty);
		await block.sign(privateKey);

		this.setStore("blocks", 0, block);
		logger.debug("created genesis block");
	}

	/**
	 * Adds a block to the blockchain after verifying it is correct.
	 */
	async appendBlock(block: Block) {
		const previousBlock = this.store.blocks.at(-1);
		if (!previousBlock) {
			throw new Error("There is no genesis block");
		}
		if (!areUint8ArraysEqual(block.previousHash, previousBlock.hash)) {
			throw new Error("Invalid previousHash");
		}
		if (!areUint8ArraysEqual(block.hash, await block.calculateHash())) {
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
							!block.transactions.some((t) =>
								areUint8ArraysEqual(t.hash, transaction.hash),
							),
					),
				),
			);
		});

		logger.success(
			`added block:${uint8ArrayToHex(block.hash.slice(0, 6))}... to chain`,
		);
	}

	/**
	 * adds a transaction to the node's mempool.
	 */
	addTransaction(transaction: Transaction) {
		if (
			this.store.mempool.some((t) =>
				areUint8ArraysEqual(t.hash, transaction.hash),
			)
		) {
			throw new Error("Transaction already exists in mempool");
		}
		this.setStore("mempool", this.store.mempool.length, transaction);
		logger.success(
			`added transaction:${uint8ArrayToHex(transaction.hash.slice(0, 6))}... to mempool`,
		);
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
