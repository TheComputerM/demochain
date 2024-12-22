import { ReactiveMap } from "@solid-primitives/map";
import { batch } from "solid-js";
import { type SetStoreFunction, createStore, reconcile } from "solid-js/store";
import {
	areUint8ArraysEqual,
	hexToUint8Array,
	uint8ArrayToHex,
} from "uint8array-extras";
import { LogError, logger } from "../logger";
import { Block } from "./block";
import type { PrivateKey, PublicKey } from "./keys";
import { Transaction } from "./transaction";

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
	 * creates the genesis block when there are no other nodes in the network.
	 */
	async createGenesisBlock(privateKey: PrivateKey, publicKey: PublicKey) {
		if (this.store.blocks.length > 0) {
			throw new LogError("Genesis block already exists");
		}

		const transaction = await Transaction.create({
			nonce: 1,
			sender: hexToUint8Array(
				// pssst, there is a secret message here
				"6d6f6e65792067726f7773206f6e20746865206d65726b6c652074726565b42a552a010675e0ee6b612e74c73f0af04009ab295772092822b541ac1d34b2a5e0fa",
			),
			recipient: publicKey.key,
			amount: 1000,
			gasFees: 0,
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
	 * adds a block to the blockchain after verifying it is correct.
	 */
	async appendBlock(block: Block) {
		const previousBlock = this.store.blocks.at(-1);
		if (!previousBlock) {
			throw new LogError("there is no genesis block");
		}
		if (!areUint8ArraysEqual(block.previousHash, previousBlock.hash)) {
			throw new LogError("invalid previousHash");
		}
		if (!areUint8ArraysEqual(block.hash, await block.calculateHash())) {
			throw new LogError("invalid block hash");
		}
		if (!block.satisfiesDifficulty(this.store.settings.difficulty)) {
			throw new LogError("block does not meet difficulty requirements");
		}

		for (const transaction of block.transactions) {
			if (this.getBalance(transaction.sender) < transaction.amount) {
				throw new LogError("sender has insufficient funds");
			}
		}

		batch(() => {
			this.setStore("blocks", this.store.blocks.length, block);
			this.setStore(
				"mempool",
				reconcile(
					this.store.mempool.filter(
						(transaction) =>
							!block.transactions.some(
								(t) =>
									areUint8ArraysEqual(t.sender, transaction.sender) &&
									t.nonce === transaction.nonce,
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
			this.store.blocks
				.flatMap((b) => b.transactions)
				.some(
					(t) =>
						areUint8ArraysEqual(t.sender, transaction.sender) &&
						t.nonce >= transaction.nonce,
				)
		) {
			throw new LogError(
				"transaction with a >= nonce is already present in the chain",
			);
		}

		this.setStore("mempool", this.store.mempool.length, transaction);
		logger.success(
			`added transaction:${transaction.nonce} from key:${uint8ArrayToHex(transaction.sender.slice(0, 6))}... to mempool`,
		);
	}

	/**
	 * validate the entire blockchain.
	 */
	static async validate(blocks: Block[]) {
		for (let i = 1; i < blocks.length; i++) {
			const block = blocks[i];
			const previousBlock = blocks[i - 1];

			if (!areUint8ArraysEqual(block.previousHash, previousBlock.hash))
				return false;

			if (!areUint8ArraysEqual(block.hash, await block.calculateHash()))
				return false;

			if (!(await block.verify())) return false;
		}
		logger.info("validated blockchain integrity");
		return true;
	}

	/**
	 * returns the balance of a given address.
	 */
	getBalance(address: Uint8Array) {
		const fromTransactions = this.store.blocks
			.flatMap((block) => block.transactions)
			.reduce((acc, transaction) => {
				if (areUint8ArraysEqual(transaction.sender, address))
					return acc - transaction.amount - transaction.gasFees;
				if (areUint8ArraysEqual(transaction.recipient, address))
					return acc + transaction.amount + transaction.gasFees;
				return acc;
			}, 0);
		return fromTransactions;
	}

	/**
	 * gets the latest transaction nonce for a given address.
	 */
	getLatestTransactionNonce(address: Uint8Array): number {
		const transactions = this.store.blocks.flatMap(
			(block) => block.transactions,
		);
		const latestTransaction = transactions.findLast((t) =>
			areUint8ArraysEqual(t.sender, address),
		);
		return latestTransaction ? latestTransaction.nonce : 0;
	}
}
